#!/usr/bin/env python3
"""
Yoga Asset Discovery & Scraper Pipeline
Usage:
  python scraper/run.py --dry-run
  python scraper/run.py --all
  python scraper/run.py --item tree-pose
  python scraper/run.py --type articles
  python scraper/run.py --type courses
  python scraper/run.py --type poses
  python scraper/run.py --type meditation
"""
import argparse
import json
import os
import sys
import time

# Support running directly or as a package
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, ROOT_DIR)

from scraper.search import discover_candidates
from scraper.validator import validate_image_data
from scraper.downloader import fetch_image_bytes, download_candidate
from scraper.optimizer import optimize_and_save
from scraper.mapper import update_yoga_assets_manifest

MANIFEST_PATH = os.path.join(SCRIPT_DIR, "manifest.json")
REPORT_PATH = os.path.join(SCRIPT_DIR, "report.json")
README_PATH = os.path.join(SCRIPT_DIR, "README.md")

def load_manifest():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def run_pipeline(dry_run=False, target_item=None, target_type=None, force=False):
    manifest = load_manifest()
    items = manifest.get("items", [])

    # Filter items if targeted
    if target_item:
        items = [i for i in items if i["id"] == target_item or i["slug"] == target_item]
        if not items:
            print(f"[ERROR] Item '{target_item}' not found in manifest.")
            return

    if target_type:
        type_norm = target_type.upper().rstrip("S") # e.g. articles -> ARTICLE
        items = [i for i in items if i["content_type"] == type_norm or i["content_type"].startswith(type_norm)]
        if not items:
            print(f"[ERROR] No items found for type '{target_type}'.")
            return

    print("=" * 70)
    print("  YOGA ASSET DISCOVERY & SCRAPE PIPELINE")
    print(f"  Mode: {'DRY RUN (Preview Only)' if dry_run else 'LIVE SCRAPE & PROCESS'}")
    print(f"  Target Items: {len(items)}")
    print("=" * 70)

    report_items = []
    total_approved = 0
    total_review = 0
    total_failed = 0

    for idx, item in enumerate(items, 1):
        item_id = item["id"]
        title = item["title"]
        content_type = item["content_type"]
        local_path = os.path.normpath(os.path.join(ROOT_DIR, *item["local_path"].replace("\\", "/").split("/")))
        cand_dir = os.path.join(os.path.dirname(local_path), "candidates")
        
        print(f"\n[{idx}/{len(items)}] {content_type}: {title} ({item_id})")
        print(f"  Target: {item['local_path']}")
        print(f"  Aspect: {item['aspect_ratio']} | Target Dimensions: {item['target_width']}x{item['target_height']}")

        # 1. Discover candidates
        candidates = discover_candidates(item)
        print(f"  Found {len(candidates)} scored candidates")

        if not candidates:
            print("  [FAILED] No suitable candidates discovered.")
            total_failed += 1
            report_items.append({
                "id": item_id,
                "title": title,
                "content_type": content_type,
                "status": "FAILED",
                "reason": "No candidates found"
            })
            continue

        selected_cand = candidates[0]
        confidence = selected_cand["total_score"]
        status = selected_cand["status"]
        
        print(f"  Top candidate: {selected_cand['id']} | Score: {confidence}/100 | Creator: {selected_cand['creator']}")
        print(f"  License: {selected_cand['license']}")
        print(f"  Source URL: {selected_cand['source_page']}")

        if dry_run:
            print(f"  [DRY-RUN] Would download {len(candidates)} candidates to {cand_dir}")
            print(f"  [DRY-RUN] Proposed production asset: {item['local_path']}")
            status_summary = "APPROVED" if confidence >= 88 else "REVIEW_REQUIRED"
            if status_summary == "APPROVED":
                total_approved += 1
            else:
                total_review += 1
            
            report_items.append({
                "id": item_id,
                "title": title,
                "content_type": content_type,
                "asset_role": item["asset_role"],
                "aspect_ratio": item["aspect_ratio"],
                "local_path": item["local_path"],
                "public_url": item["public_url"],
                "selected_candidate": selected_cand["id"],
                "confidence_score": confidence,
                "creator": selected_cand["creator"],
                "license": selected_cand["license"],
                "source_url": selected_cand["url"],
                "source_page": selected_cand["source_page"],
                "status": status_summary,
                "candidate_count": len(candidates),
                "notes": selected_cand.get("notes", "")
            })
            continue

        # LIVE EXECUTION
        valid_downloaded_cands = []
        best_data_bytes = None

        for c_idx, cand in enumerate(candidates, 1):
            try:
                print(f"    Downloading candidate {c_idx}/{len(candidates)}...")
                cand_path, data_bytes = download_candidate(cand["url"], cand_dir, c_idx, item)
                is_valid, info, reason = validate_image_data(data_bytes, item)
                
                if is_valid:
                    valid_downloaded_cands.append({
                        **cand,
                        "local_file": os.path.relpath(cand_path, ROOT_DIR),
                        "width": info["width"],
                        "height": info["height"],
                        "file_size": info["byte_size"],
                        "hash": info["content_hash"]
                    })
                    if c_idx == 1:
                        best_data_bytes = data_bytes
                    print(f"      [OK] Validated ({info['width']}x{info['height']}, {round(info['byte_size']/1024, 1)} KB)")
                else:
                    print(f"      [FAIL] Rejected candidate {c_idx}: {reason}")
            except Exception as e:
                print(f"      [ERROR] Download failed for candidate {c_idx}: {str(e)}")

        if not valid_downloaded_cands or best_data_bytes is None:
            print("  [FAILED] No downloaded candidates passed image validation.")
            total_failed += 1
            report_items.append({
                "id": item_id,
                "title": title,
                "content_type": content_type,
                "status": "FAILED",
                "reason": "Image validation failed for all candidates"
            })
            continue

        # Optimize & save final production asset
        opt_success, opt_info = optimize_and_save(best_data_bytes, local_path, item, force=force)
        
        if opt_success:
            print(f"  [SAVED] Created production asset: {item['local_path']}")
            print(f"          Dimensions: {opt_info['width']}x{opt_info['height']} | Size: {opt_info['file_size_kb']} KB")
            total_approved += 1
            final_status = "APPROVED"
        else:
            print(f"  [STATUS] {opt_info}")
            final_status = "EXISTING_PRESERVED"
            total_approved += 1

        report_items.append({
            "id": item_id,
            "title": title,
            "content_type": content_type,
            "asset_role": item["asset_role"],
            "aspect_ratio": item["aspect_ratio"],
            "local_path": item["local_path"],
            "public_url": item["public_url"],
            "selected_candidate": selected_cand["id"],
            "confidence_score": confidence,
            "creator": selected_cand["creator"],
            "license": selected_cand["license"],
            "source_url": selected_cand["url"],
            "source_page": selected_cand["source_page"],
            "status": final_status,
            "candidate_count": len(valid_downloaded_cands),
            "width": opt_info.get("width", 1200) if isinstance(opt_info, dict) else 1200,
            "height": opt_info.get("height", 800) if isinstance(opt_info, dict) else 800,
            "file_size_kb": opt_info.get("file_size_kb", 0) if isinstance(opt_info, dict) else 0,
            "notes": selected_cand.get("notes", "")
        })

    # Output manifest update & reports
    if not dry_run:
        update_yoga_assets_manifest(report_items, ROOT_DIR)
        print(f"\n[METADATA] Updated manifest at src/data/yoga-assets.json")

    # Generate scraper/report.json
    report_data = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "mode": "dry_run" if dry_run else "live",
        "summary": {
            "total_requested": len(items),
            "approved": total_approved,
            "review_required": total_review,
            "failed": total_failed
        },
        "assets": report_items
    }
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

    # Generate scraper/README.md
    generate_readme(report_data)

    print("\n" + "=" * 70)
    print("  PIPELINE COMPLETE SUMMARY")
    print(f"  Total Requested: {len(items)}")
    print(f"  Approved:        {total_approved}")
    print(f"  Review Required: {total_review}")
    print(f"  Failed:          {total_failed}")
    print(f"  Report File:     scraper/report.json")
    print(f"  Documentation:   scraper/README.md")
    print("=" * 70)

def generate_readme(report_data):
    lines = [
        "# Yoga Asset Discovery & Scraper Pipeline",
        "",
        "This pipeline discovers, validates, converts, and optimizes high-resolution, license-cleared yoga photography for **Aathi Yoga & Life**.",
        "",
        "## Summary",
        f"- **Total Requested:** {report_data['summary']['total_requested']}",
        f"- **Approved & Processed:** {report_data['summary']['approved']}",
        f"- **Review Required:** {report_data['summary']['review_required']}",
        f"- **Failed:** {report_data['summary']['failed']}",
        "",
        "## Pipeline Architecture",
        "```",
        "scraper/",
        "├── run.py          # CLI pipeline runner",
        "├── manifest.json   # 16 yoga asset specs & search requirements",
        "├── search.py       # Candidate discovery & relevance scoring",
        "├── downloader.py   # Safe candidate downloader with unique naming",
        "├── validator.py    # Dimensions, corruption & duplicate hash checks",
        "├── optimizer.py    # Aspect ratio cropping & WebP converter",
        "├── mapper.py       # JSON metadata sync (src/data/yoga-assets.json)",
        "├── report.json     # Machine-readable execution logs",
        "└── README.md       # Pipeline documentation",
        "```",
        "",
        "## Execution Commands",
        "",
        "### 1. Dry Run (Inspect Candidates without saving files)",
        "```bash",
        "python scraper/run.py --dry-run",
        "```",
        "",
        "### 2. Full Live Scrape (All 16 assets)",
        "```bash",
        "python scraper/run.py --all",
        "```",
        "",
        "### 3. Target Specific Category",
        "```bash",
        "python scraper/run.py --type articles",
        "python scraper/run.py --type courses",
        "python scraper/run.py --type poses",
        "python scraper/run.py --type meditation",
        "```",
        "",
        "### 4. Target Single Item",
        "```bash",
        "python scraper/run.py --item tree-pose",
        "```",
        "",
        "## Asset Inventory",
        "| Content Type | ID | Title | Local Path | License | Dimensions | Status |",
        "|---|---|---|---|---|---|---|"
    ]

    for a in report_data.get("assets", []):
        dims = f"{a.get('width', '-')}x{a.get('height', '-')}" if 'width' in a else a.get('aspect_ratio', '-')
        lines.append(f"| {a.get('content_type', '-')} | `{a.get('id', '-')}` | {a.get('title', '-')} | `{a.get('local_path', '-')}` | {a.get('license', '-')} | {dims} | **{a.get('status', '-')}** |")

    with open(README_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Yoga Asset Discovery & Scraper Pipeline")
    parser.add_argument("--dry-run", action="store_true", help="Search and validate candidates without saving files")
    parser.add_argument("--all", action="store_true", help="Process all items in manifest")
    parser.add_argument("--item", type=str, help="Process a single item by id or slug")
    parser.add_argument("--type", type=str, help="Process items by type: articles, courses, poses, meditation")
    parser.add_argument("--force", action="store_true", help="Allow updating existing assets")

    args = parser.parse_args()

    # Default to all if no filter given
    if not args.item and not args.type:
        args.all = True

    run_pipeline(dry_run=args.dry_run, target_item=args.item, target_type=args.type, force=args.force)
