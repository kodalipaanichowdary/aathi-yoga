"""
Metadata and Application Wiring Mapper.
Writes and syncs src/data/yoga-assets.json with the application data models.
"""
import json
import os

def update_yoga_assets_manifest(records, root_dir):
    """
    Writes updated yoga-assets.json into src/data/ and data/.
    """
    manifest_data = {
        "version": "1.0.0",
        "last_updated": "2026-08-13",
        "total_assets": len(records),
        "assets": records
    }

    src_data_path = os.path.join(root_dir, "src", "data", "yoga-assets.json")
    root_data_path = os.path.join(root_dir, "data", "yoga-assets.json")

    os.makedirs(os.path.dirname(src_data_path), exist_ok=True)
    os.makedirs(os.path.dirname(root_data_path), exist_ok=True)

    with open(src_data_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    with open(root_data_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    return src_data_path
