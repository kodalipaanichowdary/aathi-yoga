"""
Image Optimization, Graceful Aspect Cropping, and WebP Converter.
Outputs production WebP files (hero.webp, thumbnail.webp, pose.webp, cover.webp)
with safe file preservation.
"""
import io
import os
from PIL import Image

def crop_to_aspect(img, target_aspect):
    """
    Crops image gracefully around center to target aspect ratio.
    """
    w, h = img.size
    current_aspect = w / h

    if abs(current_aspect - target_aspect) < 0.02:
        return img

    if current_aspect > target_aspect:
        # Too wide -> crop left and right
        new_w = int(h * target_aspect)
        offset = (w - new_w) // 2
        return img.crop((offset, 0, offset + new_w, h))
    else:
        # Too tall -> crop top and bottom
        new_h = int(w / target_aspect)
        offset = (h - new_h) // 2
        return img.crop((0, offset, w, offset + new_h))

def optimize_and_save(data_bytes, target_path, item_spec, force=False):
    """
    Converts and saves validated image to optimized WebP.
    Safe file check: never silently overwrites an existing file unless force=True.
    """
    if os.path.exists(target_path) and not force:
        return False, f"Existing asset detected: {target_path} (skipping without --force)"

    os.makedirs(os.path.dirname(target_path), exist_ok=True)

    img = Image.open(io.BytesIO(data_bytes))
    
    # Convert RGBA / P / CMYK to RGB
    if img.mode in ("RGBA", "LA"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    target_aspect = item_spec.get("target_aspect", 1.777)
    target_w = item_spec.get("target_width", 1200)
    target_h = item_spec.get("target_height", 675)

    # Center crop to target aspect ratio
    cropped = crop_to_aspect(img, target_aspect)

    # Resize if significantly larger than target while keeping sharp fidelity
    if cropped.width > target_w * 1.5:
        cropped.thumbnail((target_w * 1.25, target_h * 1.25), Image.Resampling.LANCZOS)

    # Save to WebP
    cropped.save(target_path, "WEBP", quality=85, method=6)
    
    final_size = os.path.getsize(target_path)
    return True, {
        "output_path": target_path,
        "width": cropped.width,
        "height": cropped.height,
        "aspect_ratio": round(cropped.width / cropped.height, 3),
        "file_size_bytes": final_size,
        "file_size_kb": round(final_size / 1024, 1)
    }
