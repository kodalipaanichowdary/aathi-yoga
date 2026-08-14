"""
Downloader Module for Yoga Asset Pipeline.
Handles polite downloading, candidate storage, and unique file naming.
"""
import os
import urllib.request
import time

USER_AGENT = "AathiYogaAssetSync/1.0 (internal wellness photography sync)"

def get_unique_filepath(filepath):
    """
    Returns non-colliding filepath if file already exists.
    e.g. candidate-01.webp -> candidate-01_1.webp
    """
    if not os.path.exists(filepath):
        return filepath

    base, ext = os.path.splitext(filepath)
    counter = 1
    while os.path.exists(f"{base}_{counter}{ext}"):
        counter += 1
    return f"{base}_{counter}{ext}"

def fetch_image_bytes(url, timeout=20):
    """
    Downloads image data bytes with polite rate-limiting headers.
    """
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
        }
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        if response.status != 200:
            raise Exception(f"HTTP error {response.status}")
        return response.read()

def download_candidate(url, candidate_dir, cand_index=1, item_spec=None):
    """
    Downloads candidate and stores in <asset-directory>/candidates/candidate-XX.webp
    """
    os.makedirs(candidate_dir, exist_ok=True)
    filename = f"candidate-{cand_index:02d}.webp"
    target_path = get_unique_filepath(os.path.join(candidate_dir, filename))

    data_bytes = fetch_image_bytes(url)
    
    # Save raw or optimized candidate WebP
    from .optimizer import optimize_and_save
    success, res = optimize_and_save(data_bytes, target_path, item_spec, force=True)
    
    if not success:
        with open(target_path, "wb") as f:
            f.write(data_bytes)

    return target_path, data_bytes
