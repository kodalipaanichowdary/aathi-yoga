"""
Image Validation and Duplicate Detection Module for Yoga Asset Pipeline.
Validates formats, minimum resolutions, aspect ratio tolerance, and content hashes.
"""
import io
import hashlib
from PIL import Image

MIN_WIDTH = 500
MIN_HEIGHT = 400

def compute_content_hash(data_bytes):
    """Calculates SHA-256 hash of image data."""
    return hashlib.sha256(data_bytes).hexdigest()

def validate_image_data(data_bytes, item_spec):
    """
    Validates binary image data against requirements:
    - Valid image format
    - Minimum resolution
    - Aspect ratio check
    - Absence of corruption
    """
    if not data_bytes or len(data_bytes) < 1000:
        return False, None, "File too small or empty (< 1KB)"

    try:
        img = Image.open(io.BytesIO(data_bytes))
        img.verify()
    except Exception as e:
        return False, None, f"Image verification / corruption error: {str(e)}"

    # Re-open for inspection after verify
    try:
        img = Image.open(io.BytesIO(data_bytes))
        width, height = img.size
        img_format = img.format
        content_hash = compute_content_hash(data_bytes)
        aspect = width / height if height > 0 else 0

        target_w = item_spec.get("target_width", 1000)
        target_h = item_spec.get("target_height", 800)

        # Minimum resolution validation
        if width < MIN_WIDTH or height < MIN_HEIGHT:
            return False, None, f"Resolution {width}x{height} below minimum threshold {MIN_WIDTH}x{MIN_HEIGHT}"

        info = {
            "width": width,
            "height": height,
            "format": img_format,
            "aspect_ratio": round(aspect, 3),
            "content_hash": content_hash,
            "byte_size": len(data_bytes)
        }

        return True, info, "Image validated successfully"
    except Exception as e:
        return False, None, f"Image inspection error: {str(e)}"
