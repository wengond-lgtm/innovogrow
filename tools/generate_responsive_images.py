from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "site-images"


TASKS = [
    {"name": "home-hero-background.jpg", "widths": [768, 1280, 1920]},
    {"name": "solutions-hero-background.jpg", "widths": [768, 1280, 1920]},
    {"name": "resources-hero-background.jpg", "widths": [768, 1280, 1920]},
    {"name": "about-hero-background.jpg", "widths": [768, 1280, 1920]},
    {"name": "contact-hero-background.jpg", "widths": [768, 1280, 1920]},
    {"name": "home-challenge-diagram.jpg", "widths": [640, 960, 1440]},
    {"name": "shared-grow-scene.jpg", "widths": [640, 960, 1400]},
    {"name": "resources-case-vertical-farming.png", "widths": [480, 768, 1200]},
    {"name": "resources-case-greenhouse-tomatoes.png", "widths": [480, 768, 1200]},
    {"name": "resources-case-cannabis-cultivation.png", "widths": [480, 768, 1200]},
    {"name": "resources-case-indoor-grow-rooms.png", "widths": [480, 768, 1200]},
    {"name": "solutions-usecase-high-density-flowering-crops.jpg", "widths": [480, 768, 1200]},
    {"name": "solutions-usecase-greenhouse-cultivation.jpg", "widths": [480, 768, 1200]},
    {"name": "solutions-usecase-vertical-farming.jpg", "widths": [480, 768, 1200]},
    {"name": "solutions-usecase-indoor-grow-rooms.jpg", "widths": [480, 768, 1200]},
    {"name": "about-story-photo.jpg", "widths": [400, 800]},
    {"name": "about-proof-photo.jpg", "widths": [400, 600]},
    {"name": "solutions-cta-team-photo.jpg", "widths": [480, 960, 1280]},
]


def ensure_rgb(image: Image.Image) -> Image.Image:
    if image.mode in ("RGB", "L"):
        return image.convert("RGB")
    return image.convert("RGB")


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    if width >= image.width:
        return image.copy()
    height = round(image.height * (width / image.width))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def save_variants(task: dict) -> None:
    source_path = ASSET_DIR / task["name"]
    original = Image.open(source_path)
    rgb_image = ensure_rgb(original)
    stem = source_path.stem

    for width in task["widths"]:
        resized = resize_to_width(rgb_image, width)

        jpg_path = ASSET_DIR / f"{stem}-{width}w.jpg"
        webp_path = ASSET_DIR / f"{stem}-{width}w.webp"

        resized.save(jpg_path, format="JPEG", quality=84, optimize=True, progressive=True)
        resized.save(webp_path, format="WEBP", quality=82, method=6)


def main() -> None:
    for task in TASKS:
        save_variants(task)
        print(f"generated: {task['name']}")


if __name__ == "__main__":
    main()
