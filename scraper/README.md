# Yoga Asset Discovery & Scraper Pipeline

This pipeline discovers, validates, converts, and optimizes high-resolution, license-cleared yoga photography for **Aathi Yoga & Life**.

## Summary
- **Total Requested:** 16
- **Approved & Processed:** 16
- **Review Required:** 0
- **Failed:** 0

## Pipeline Architecture
```
scraper/
├── run.py          # CLI pipeline runner
├── manifest.json   # 16 yoga asset specs & search requirements
├── search.py       # Candidate discovery & relevance scoring
├── downloader.py   # Safe candidate downloader with unique naming
├── validator.py    # Dimensions, corruption & duplicate hash checks
├── optimizer.py    # Aspect ratio cropping & WebP converter
├── mapper.py       # JSON metadata sync (src/data/yoga-assets.json)
├── report.json     # Machine-readable execution logs
└── README.md       # Pipeline documentation
```

## Execution Commands

### 1. Dry Run (Inspect Candidates without saving files)
```bash
python scraper/run.py --dry-run
```

### 2. Full Live Scrape (All 16 assets)
```bash
python scraper/run.py --all
```

### 3. Target Specific Category
```bash
python scraper/run.py --type articles
python scraper/run.py --type courses
python scraper/run.py --type poses
python scraper/run.py --type meditation
```

### 4. Target Single Item
```bash
python scraper/run.py --item tree-pose
```

## Asset Inventory
| Content Type | ID | Title | Local Path | License | Dimensions | Status |
|---|---|---|---|---|---|---|
| ARTICLE | `breath-basics` | The Breath Basics Every Beginner Should Know | `public/assets/yoga/articles/breath-basics/hero.webp` | Unsplash Commercial Free License | 1600x900 | **APPROVED** |
| ARTICLE | `morning-vs-evening` | Morning Practice vs. Evening Practice | `public/assets/yoga/articles/morning-vs-evening/hero.webp` | Unsplash Commercial Free License | 1600x900 | **APPROVED** |
| ARTICLE | `sore-muscles` | Sore After Yoga? Here's What's Normal | `public/assets/yoga/articles/sore-muscles/hero.webp` | Unsplash Commercial Free License | 1600x900 | **APPROVED** |
| ARTICLE | `building-consistency` | Building a Practice You'll Actually Keep | `public/assets/yoga/articles/building-consistency/hero.webp` | Unsplash Commercial Free License | 1600x900 | **APPROVED** |
| COURSE | `beg-01` | Morning Flow Basics | `public/assets/yoga/courses/morning-flow-basics/thumbnail.webp` | Unsplash Commercial Free License | 1177x883 | **APPROVED** |
| COURSE | `beg-02` | Foundations of Breath | `public/assets/yoga/courses/foundations-of-breath/thumbnail.webp` | Unsplash Commercial Free License | 1400x1050 | **APPROVED** |
| COURSE | `int-01` | Strength & Balance Flow | `public/assets/yoga/courses/strength-balance-flow/thumbnail.webp` | Unsplash Commercial Free License | 1244x933 | **APPROVED** |
| COURSE | `int-02` | Focused Balance Series | `public/assets/yoga/courses/focused-balance-series/thumbnail.webp` | Unsplash Commercial Free License | 1400x1050 | **APPROVED** |
| COURSE | `adv-01` | Power Warrior Sequence | `public/assets/yoga/courses/power-warrior-sequence/thumbnail.webp` | Unsplash Commercial Free License | 1244x933 | **APPROVED** |
| COURSE | `adv-02` | Deep Focus Practice | `public/assets/yoga/courses/deep-focus-practice/thumbnail.webp` | Unsplash Commercial Free License | 1400x1050 | **APPROVED** |
| POSE | `mountain-pose` | Mountain Pose (Tadasana) | `public/assets/yoga/poses/mountain-pose/pose.webp` | Unsplash Commercial Free License | 1200x1200 | **APPROVED** |
| POSE | `child-pose` | Child's Pose (Balasana) | `public/assets/yoga/poses/child-pose/pose.webp` | Unsplash Commercial Free License | 800x800 | **APPROVED** |
| POSE | `warrior-pose` | Warrior II (Virabhadrasana II) | `public/assets/yoga/poses/warrior-pose/pose.webp` | Unsplash Commercial Free License | 800x800 | **APPROVED** |
| POSE | `tree-pose` | Tree Pose (Vrksasana) | `public/assets/yoga/poses/tree-pose/pose.webp` | Unsplash Commercial Free License | 1200x1200 | **APPROVED** |
| POSE | `seated-meditation` | Seated Meditation (Sukhasana / Padmasana) | `public/assets/yoga/poses/seated-meditation/pose.webp` | Unsplash Commercial Free License | 1200x1200 | **APPROVED** |
| MEDITATION | `morning-calm` | Morning Calm Meditation | `public/assets/yoga/meditation/morning-calm/cover.webp` | Unsplash Commercial Free License | 1600x900 | **APPROVED** |
