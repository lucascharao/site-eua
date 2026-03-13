#!/usr/bin/env python3
"""Pre-generate all tile images using Gemini API and save as static files."""
import os, json, base64, urllib.request, sys, time

API_KEY = "AIzaSyCOjVm_EyxMuwCTpVwx59ZXQM8IAyY0r8Q"
MODEL = "gemini-2.0-flash-exp-image-generation"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
REF_IMAGE_URL = "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "generated-tiles")

TILES = [
    {
        "id": "carrara-marble",
        "name": "Carrara White Marble",
        "description": "Classic Italian Carrara marble with distinctive soft grey veining on white background. 12x24 polished finish. Each tile has unique grey vein patterns running diagonally.",
    },
    {
        "id": "white-subway-3x6",
        "name": "White Subway 3x6",
        "description": "Classic white ceramic subway tile 3x6 inches with visible white grout lines forming a brick-lay pattern. Glossy flat finish.",
    },
    {
        "id": "large-format-white",
        "name": "Large Format Porcelain 24x48",
        "description": "Modern large format white porcelain tile 24x48 inches. Very minimal grout lines, smooth polished surface with subtle light grey tones.",
    },
    {
        "id": "travertine-ivory",
        "name": "Ivory Travertine",
        "description": "Natural ivory travertine stone tile with warm beige/tan tones and visible natural pitting and texture. Honed finish. 18x18 format with noticeable grout lines.",
    },
    {
        "id": "hexagon-marble-mosaic",
        "name": "Hexagon Marble Mosaic",
        "description": "Small 2-inch white marble hexagon mosaic tiles with thin gold/brass inlay lines between each hexagon. Distinctive honeycomb pattern clearly visible.",
    },
    {
        "id": "zellige-blue",
        "name": "Zellige Blue",
        "description": "Handmade Moroccan zellige tile in deep ocean blue color. 4x4 square format with irregular glossy surface showing handmade imperfections and color variations.",
    },
    {
        "id": "herringbone-calacatta",
        "name": "Herringbone Calacatta",
        "description": "Calacatta gold marble pieces arranged in a V-shaped herringbone/chevron pattern. White marble with dramatic gold and dark grey veining. The herringbone pattern is the key visual feature.",
    },
    {
        "id": "wood-look-porcelain",
        "name": "Wood-Look Porcelain Plank",
        "description": "Wood-look porcelain plank tile in warm medium oak brown color. 8x48 long plank format with realistic wood grain texture and knots. Clearly looks like wood flooring on walls.",
    },
]

def get_reference_image():
    print("Downloading reference shower image...")
    req = urllib.request.Request(REF_IMAGE_URL)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    print(f"  Reference image: {len(data)} bytes")
    return base64.b64encode(data).decode()

def generate_tile(ref_b64, tile, retries=3):
    prompt = f"""Look at this shower photo. I need you to edit ONLY the wall tiles.

CRITICAL INSTRUCTIONS:
- Keep the EXACT SAME shower structure: glass enclosure, gold fixtures, showerhead position, niche, lighting, camera angle, perspective
- The overall image composition must be IDENTICAL to the reference
- ONLY replace the tile texture on the walls with: {tile['name']}
- Tile description: {tile['description']}
- The new tiles must look photorealistic with proper grout lines, light reflections, and shadows matching the original lighting
- Do NOT change anything else: no new fixtures, no different angle, no different shower design
- Do NOT add any text, watermarks, or labels
- Output a high quality photorealistic result"""

    body = {
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": "image/jpeg", "data": ref_b64}},
                {"text": prompt},
            ]
        }],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "temperature": 0.3,
        },
    }

    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                URL,
                data=json.dumps(body).encode(),
                method="POST",
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read())

            parts = result.get("candidates", [{}])[0].get("content", {}).get("parts", [])
            for p in parts:
                if "inlineData" in p:
                    return p["inlineData"]["data"], p["inlineData"]["mimeType"]

            print(f"    No image in response, attempt {attempt+1}")
            if attempt < retries - 1:
                time.sleep(3)
        except Exception as e:
            print(f"    Error attempt {attempt+1}: {e}")
            if attempt < retries - 1:
                time.sleep(5)

    return None, None

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Check which tiles already exist
    existing = set()
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith(".png") or f.endswith(".jpg"):
            existing.add(f.rsplit(".", 1)[0])

    tiles_to_generate = [t for t in TILES if t["id"] not in existing]

    if not tiles_to_generate:
        print("All tiles already generated! Nothing to do.")
        return

    print(f"Need to generate {len(tiles_to_generate)} tiles (skipping {len(existing)} existing)")

    # Only specific tiles? Pass as args
    if len(sys.argv) > 1:
        ids = sys.argv[1:]
        tiles_to_generate = [t for t in TILES if t["id"] in ids]
        print(f"Generating only: {[t['id'] for t in tiles_to_generate]}")

    ref_b64 = get_reference_image()

    for i, tile in enumerate(tiles_to_generate):
        print(f"\n[{i+1}/{len(tiles_to_generate)}] Generating: {tile['name']}...")
        img_data, mime = generate_tile(ref_b64, tile)

        if img_data:
            ext = "png" if "png" in (mime or "") else "jpg"
            path = os.path.join(OUTPUT_DIR, f"{tile['id']}.{ext}")
            with open(path, "wb") as f:
                f.write(base64.b64decode(img_data))
            size_kb = os.path.getsize(path) / 1024
            print(f"  Saved: {path} ({size_kb:.0f} KB)")
        else:
            print(f"  FAILED to generate {tile['name']}")

        # Rate limit
        if i < len(tiles_to_generate) - 1:
            print("  Waiting 3s (rate limit)...")
            time.sleep(3)

    print("\nDone! All tiles saved to", OUTPUT_DIR)

if __name__ == "__main__":
    main()
