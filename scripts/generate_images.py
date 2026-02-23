#!/usr/bin/env python3
"""
generate_images.py

Generates all challenge images for FakeSpotter using the MiniMax image API.
Images are saved to:
  public/images/challenges/   — per-challenge AI/real evidence images
  public/images/ui/           — landing page & category card images

Usage:
    MINIMAX_API_KEY=your_key python scripts/generate_images.py

Optional flags:
    --challenge 5      generate only images for challenge 5
    --ui-only          generate only UI / landing-page images
    --force            overwrite existing files (default: skip)
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# ── Config ───────────────────────────────────────────────────────────────────

API_KEY = os.environ.get("MINIMAX_API_KEY")
if not API_KEY:
    print("❌  Missing MINIMAX_API_KEY environment variable.")
    print("    Usage: MINIMAX_API_KEY=your_key python scripts/generate_images.py")
    sys.exit(1)

API_URL = "https://api.minimaxi.chat/v1/image_generation"
MODEL   = "image-01"

ROOT           = Path(__file__).resolve().parent.parent
CHALLENGES_DIR = ROOT / "public" / "images" / "challenges"
UI_DIR         = ROOT / "public" / "images" / "ui"

ASPECT_RATIO = {
    "landscape": "16:9",
    "portrait":  "2:3",
    "square":    "1:1",
}

# ── Image definitions ─────────────────────────────────────────────────────────
#
# "type"  → aspect ratio key: landscape / portrait / square
# "variant" (challenge images only) → "ai" or "real"
#
# Prompts embed the specific artefacts from challenge-examples.md so the
# AI-generated images look plausibly real but contain the forensic tells
# each challenge teaches users to spot.
# ─────────────────────────────────────────────────────────────────────────────

CHALLENGE_IMAGES = [

    # ── Challenge 1 · Vendor Invoice ─────────────────────────────────────────
    {
        "challenge_id": 1, "variant": "ai",
        "file": "challenge-01-invoice-ai.jpg",
        "type": "portrait",
        "prompt": (
            "Professional vendor invoice document photograph, slightly overhead angle on a clean white desk. "
            "The invoice has a crisp logo header 'TechSupply Solutions', perfectly aligned columns, "
            "all line item amounts ending in .00, sequential invoice number INV-2024-001234, "
            "generic address '123 Business Street'. Lighting is unnaturally even with no shadows, "
            "perfectly white paper background. Hyper-clean, too perfect, corporate document photography."
        ),
    },
    {
        "challenge_id": 1, "variant": "real",
        "file": "challenge-01-invoice-real.jpg",
        "type": "portrait",
        "prompt": (
            "Real vendor invoice document photograph on a slightly cluttered office desk. "
            "Paper has minor creases, the logo header is slightly off-centre, prices like $47.23 and $156.78, "
            "invoice number with non-sequential gap (INV-2023-9847), specific address with suite and ZIP+4. "
            "Natural office lighting casting soft shadows, slight paper yellowing at edges, "
            "coffee ring stain barely visible at bottom corner. Authentic office document photography."
        ),
    },

    # ── Challenge 2 · CEO Video Message ──────────────────────────────────────
    {
        "challenge_id": 2, "variant": "ai",
        "file": "challenge-02-video-ai.jpg",
        "type": "landscape",
        "prompt": (
            "Video still frame of a business executive speaking to camera in an office setting. "
            "The face shows a very slight blurring at the hair edges where it meets the background. "
            "The bookshelf background has slightly different lighting temperature from the face. "
            "Eyes are unnaturally forward-facing with perfect gaze. Expression looks almost right "
            "but slightly off, like a digital composite. HD quality corporate video still. "
            "Subtle deepfake artefact: hair edge softening, face lighting mismatched with background."
        ),
    },
    {
        "challenge_id": 2, "variant": "real",
        "file": "challenge-02-video-real.jpg",
        "type": "landscape",
        "prompt": (
            "Video still frame of a real business executive speaking in a corporate office, "
            "natural expression mid-sentence, slight motion blur on a hand gesture, "
            "authentic window light creating a soft shadow on one side of the face, "
            "background bookshelf slightly out of focus with natural depth of field, "
            "consistent lighting between face and background. Natural corporate video quality."
        ),
    },

    # ── Challenge 3 · Bank Fraud Voicemail ───────────────────────────────────
    {
        "challenge_id": 3, "variant": "ai",
        "file": "challenge-03-audio-ai.jpg",
        "type": "portrait",
        "prompt": (
            "Smartphone screen showing a voicemail notification from '1-800-YOURBANK' bank fraud department. "
            "The voicemail player UI is visible with a 0:30 duration. "
            "The audio waveform display looks suspiciously regular and perfectly symmetrical. "
            "Call flagged from unknown number spoofing a bank. "
            "Phone UI screenshot style, realistic iOS or Android voicemail screen."
        ),
    },
    {
        "challenge_id": 3, "variant": "real",
        "file": "challenge-03-audio-real.jpg",
        "type": "portrait",
        "prompt": (
            "Smartphone screen showing a legitimate bank voicemail notification from the official bank app. "
            "Verified caller ID with bank logo, audio waveform showing natural irregular speech variation, "
            "irregular amplitude peaks typical of real human speech. "
            "Duration 0:28, notification from verified bank contact. Natural phone screenshot."
        ),
    },

    # ── Challenge 4 · Service Agreement Amendment ────────────────────────────
    {
        "challenge_id": 4, "variant": "real",
        "file": "challenge-04-contract-real.jpg",
        "type": "portrait",
        "prompt": (
            "Legal contract document page photographed on a desk, 'SERVICE AGREEMENT AMENDMENT NO. 3' heading, "
            "visible clause numbers 4.1, 4.3, 7(b)(ii) with non-sequential gaps, "
            "DocuSign digital signature block at bottom with timestamp, "
            "minor paper handling marks, slightly uneven scan, "
            "natural legal document formatting. Slight perspective angle, authentic."
        ),
    },

    # ── Challenge 5 · Product Quality Photos ─────────────────────────────────
    {
        "challenge_id": 5, "variant": "ai",
        "file": "challenge-05-product-ai.jpg",
        "type": "square",
        "prompt": (
            "Product photography of electronic PCB circuit board assembly on pure white background. "
            "Shadows are mathematically perfect at 45 degrees, perfectly consistent across the board. "
            "Metallic surface reflections are uniformly mirror-flat with no environmental details. "
            "Component text (part numbers) is slightly blurred and inconsistent weight. "
            "Zero dust, fingerprints, or handling marks. Solder joints unnaturally smooth. "
            "Lighting is perfectly even with no hotspots or variations. "
            "Hyper-clean AI-generated product photography, too perfect to be real."
        ),
    },
    {
        "challenge_id": 5, "variant": "real",
        "file": "challenge-05-product-real.jpg",
        "type": "square",
        "prompt": (
            "Real product photography of an electronic PCB circuit board on a light grey background. "
            "Natural shadow variations, slight photographer reflection visible in metallic capacitor surface. "
            "Sharp, readable component part numbers and manufacturer markings. "
            "Subtle lighting gradient, minor dust particles, slight fingerprint smudge at edge. "
            "Solder joints show natural texture variation. Authentic professional product photograph."
        ),
    },

    # ── Challenge 6 · HR Policy Email ────────────────────────────────────────
    {
        "challenge_id": 6, "variant": "ai",
        "file": "challenge-06-email-ai.jpg",
        "type": "landscape",
        "prompt": (
            "Screenshot of a suspicious phishing email in a corporate email client (Outlook style). "
            "From: hr-director@company-hr-portal.net — suspicious external domain. "
            "Subject: URGENT: New Security Policy Implementation — Action Required. "
            "Body text is overly formal, no recipient name (says Dear Valued Employee). "
            "Contains a suspicious link. Red warning banner at top from email client. "
            "Realistic email client screenshot, clearly suspicious phishing layout."
        ),
    },
    {
        "challenge_id": 6, "variant": "real",
        "file": "challenge-06-email-real.jpg",
        "type": "landscape",
        "prompt": (
            "Screenshot of a legitimate internal HR email in a corporate email client (Outlook style). "
            "From: sarah.johnson@yourcompany.com — official company domain with verified checkmark. "
            "Subject: Q2 2024 Security Policy Update — Please Review by Friday. "
            "Greeting uses actual employee name, references specific policy number, "
            "links to internal SharePoint intranet. Casual professional tone. No urgency threats."
        ),
    },

    # ── Challenge 7 · Board Meeting Recording ────────────────────────────────
    {
        "challenge_id": 7, "variant": "real",
        "file": "challenge-07-meeting-real.jpg",
        "type": "landscape",
        "prompt": (
            "Zoom meeting screenshot with 4 participants in a board meeting. "
            "Conference room view, mixed camera quality across participants. "
            "One participant is mid-sentence with natural motion blur, another has notes visible. "
            "Recording indicator showing 2:14 duration. Natural video conferencing screenshot."
        ),
    },

    # ── Challenge 8 · Quarterly Financial Report ─────────────────────────────
    {
        "challenge_id": 8, "variant": "ai",
        "file": "challenge-08-financial-ai.jpg",
        "type": "portrait",
        "prompt": (
            "Financial report document page showing a P&L statement with suspiciously perfect numbers. "
            "Apex Manufacturing Holdings Inc. header. "
            "Revenue $12,400,000 | COGS exactly 60.0% | Gross Profit exactly 40.0% | Net Income exactly 10.0%. "
            "All figures are perfectly round, no accounting adjustments noted anywhere. "
            "Professional financial document layout, PDF style, clean corporate typography. "
            "Numbers look artificially perfect and unnaturally consistent."
        ),
    },
    {
        "challenge_id": 8, "variant": "real",
        "file": "challenge-08-financial-real.jpg",
        "type": "portrait",
        "prompt": (
            "Real quarterly financial report page with natural, irregular numbers. "
            "Revenue $11,847,293 | COGS 58.3% | minor accounting reclassification note at bottom. "
            "Prior period adjustment line item, specific footnote references, "
            "slight formatting inconsistency in table, minor correction in margin. "
            "Authentic audited financial document with natural imperfections."
        ),
    },

    # ── Challenge 9 · CEO Onboarding Welcome Video ───────────────────────────
    {
        "challenge_id": 9, "variant": "real",
        "file": "challenge-09-video-real.jpg",
        "type": "landscape",
        "prompt": (
            "Corporate training video still frame of a CEO giving a welcome speech in an executive boardroom. "
            "Natural daylight from left window creating authentic shadow on left cheek. "
            "Executive has slightly off-centre lapel pin, caught mid-natural-gesture with hand raised, "
            "brief note glance downward — authentic speaker behaviour. "
            "Natural expression, slight motion blur on hand, professional but genuine corporate video."
        ),
    },

    # ── Challenge 10 · Driver Licence Scan ───────────────────────────────────
    {
        "challenge_id": 10, "variant": "ai",
        "file": "challenge-10-id-ai.jpg",
        "type": "landscape",
        "prompt": (
            "Scanned driver's licence document, New York state, high resolution 600 DPI scan. "
            "Holographic overlay looks completely flat with no depth or colour-shift variation. "
            "Photo background has mathematically perfect radial gradient with no natural variation. "
            "Microprint text along bottom strip is blurred and partially illegible. "
            "Ghost image in lower-left corner proportionally slightly too large. "
            "Realistic-looking but forensically incorrect government ID document."
        ),
    },
    {
        "challenge_id": 10, "variant": "real",
        "file": "challenge-10-id-real.jpg",
        "type": "landscape",
        "prompt": (
            "Authentic scanned New York state driver's licence, 600 DPI scan. "
            "Holographic security overlay shows proper multi-colour depth and angle shift. "
            "DMV-style photo with natural flat lighting and subtle background variation. "
            "All security features correctly positioned and proportioned. "
            "Sharp, crisp microprint text fully legible at this resolution. "
            "Correct ghost image size in lower left, proper NY state typography throughout."
        ),
    },
]

# ── UI / landing-page images ─────────────────────────────────────────────────

UI_IMAGES = [
    {
        "file": "hero-bg.jpg",
        "type": "landscape",
        "prompt": (
            "Dark futuristic digital workspace abstract background image for a cybersecurity website. "
            "Deep navy and charcoal tones, subtle grid lines, glowing data streams, "
            "holographic document overlays floating in space, binary code suggestions in background. "
            "Professional, modern, slightly ominous — the feeling of AI surveillance and digital verification. "
            "No people, no text, purely abstract atmospheric background. Wide cinematic aspect ratio."
        ),
    },
    {
        "file": "category-document.jpg",
        "type": "square",
        "prompt": (
            "Close-up abstract image representing document verification and authentication. "
            "Stack of business documents with a magnifying glass, subtle red FAKE watermark faintly visible on one. "
            "Dark professional tone with accent lighting. Corporate document security concept art."
        ),
    },
    {
        "file": "category-video.jpg",
        "type": "square",
        "prompt": (
            "Abstract image representing deepfake video detection. "
            "Human face partially pixelated or glitching, digital grid overlay, "
            "split-screen showing real and fake halves. Dark techy background with blue and orange accent. "
            "Cybersecurity video authentication concept art. No real person, stylised illustration."
        ),
    },
    {
        "file": "category-audio.jpg",
        "type": "square",
        "prompt": (
            "Abstract image representing voice cloning and audio fraud detection. "
            "Sound waveform visualization in neon green on dark background, "
            "one section of the waveform looking suspiciously artificial and perfectly looped, "
            "headphones silhouette overlay. Audio forensics cybersecurity concept art."
        ),
    },
    {
        "file": "category-image.jpg",
        "type": "square",
        "prompt": (
            "Abstract image representing AI image detection and verification. "
            "Camera lens with digital overlay showing AUTHENTIC / GENERATED scan lines across a photo. "
            "Pixel-level examination effect with magnified grid squares. "
            "Dark background, teal and white accent colours. AI image forensics concept art."
        ),
    },
]


# ── API helpers ───────────────────────────────────────────────────────────────

def generate_image(prompt: str, img_type: str = "landscape") -> str:
    """Call MiniMax image generation API. Returns the image URL."""
    payload = json.dumps({
        "model":         MODEL,
        "prompt":        prompt,
        "aspect_ratio":  ASPECT_RATIO.get(img_type, "16:9"),
        "response_format": "url",
        "n":             1,
    }).encode()

    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type":  "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())

    urls = data.get("data", {}).get("image_urls")
    if not urls:
        raise RuntimeError(f"API error: {data}")
    return urls[0]


def download_image(url: str, dest: Path) -> None:
    """Download an image URL to a local file, following redirects."""
    req = urllib.request.Request(url, headers={"User-Agent": "FakeSpotter/1.0"})
    with urllib.request.urlopen(req) as resp:
        dest.write_bytes(resp.read())


def process_image(img: dict, output_dir: Path, label: str, force: bool) -> None:
    """Generate and save a single image. Skips if file exists and not --force."""
    dest = output_dir / img["file"]

    if dest.exists() and not force:
        print(f"  ⏭️  Skipping {label} — already exists (use --force to overwrite)")
        return

    print(f"  🎨 Generating: {label}")
    print(f"     prompt: {img['prompt'][:80]}…")

    try:
        url = generate_image(img["prompt"], img["type"])
        download_image(url, dest)
        print(f"  ✅ Saved → {dest.relative_to(ROOT)}")
    except Exception as exc:
        print(f"  ❌ Failed: {label} — {exc}")

    time.sleep(1.5)   # respect rate limits


# ── CLI ───────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate FakeSpotter challenge images via MiniMax API"
    )
    parser.add_argument("--challenge", type=int, default=None,
                        help="Generate only images for this challenge ID (1–10)")
    parser.add_argument("--ui-only", action="store_true",
                        help="Generate only UI / landing-page images")
    parser.add_argument("--force", action="store_true",
                        help="Overwrite existing images")
    return parser.parse_args()


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()

    CHALLENGES_DIR.mkdir(parents=True, exist_ok=True)
    UI_DIR.mkdir(parents=True, exist_ok=True)

    print("\n🔍 FakeSpotter — MiniMax Image Generator\n")

    # ── Challenge images ────────────────────────────────────────────────────
    if not args.ui_only:
        filtered = (
            [img for img in CHALLENGE_IMAGES if img["challenge_id"] == args.challenge]
            if args.challenge
            else CHALLENGE_IMAGES
        )

        if args.challenge and not filtered:
            print(f"❌  No challenge images found for --challenge {args.challenge}")
            sys.exit(1)

        print(f"📸 Generating {len(filtered)} challenge image(s)…\n")
        for img in filtered:
            label = (
                f"Challenge {img['challenge_id']} · "
                f"{img['variant'].upper()} ({img['file']})"
            )
            process_image(img, CHALLENGES_DIR, label, args.force)

    # ── UI images ───────────────────────────────────────────────────────────
    if not args.challenge:
        print(f"\n🖼️  Generating {len(UI_IMAGES)} UI image(s)…\n")
        for img in UI_IMAGES:
            process_image(img, UI_DIR, f"UI · {img['file']}", args.force)

    # ── Summary ─────────────────────────────────────────────────────────────
    all_files = (
        [f"public/images/challenges/{f.name}" for f in CHALLENGES_DIR.iterdir() if f.is_file()]
        + [f"public/images/ui/{f.name}"        for f in UI_DIR.iterdir()         if f.is_file()]
    )
    print(f"\n{'─' * 55}")
    print(f"\n✅  Done. {len(all_files)} image(s) in output directories:")
    for f in sorted(all_files):
        print(f"   {f}")

    print("\n📋  imageUrl mapping for challenges.ts:\n")
    for img in CHALLENGE_IMAGES:
        dest = CHALLENGES_DIR / img["file"]
        if dest.exists():
            print(
                f"  Challenge {img['challenge_id']} ({img['variant']}): "
                f'"/images/challenges/{img["file"]}"'
            )
    print()


if __name__ == "__main__":
    main()
