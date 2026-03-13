import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`;

const imageCache = new Map<string, string>();
let referenceImageBase64: string | null = null;

const REFERENCE_IMAGE_URL = "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80";

async function getReferenceImage(): Promise<string> {
  if (referenceImageBase64) return referenceImageBase64;
  const res = await fetch(REFERENCE_IMAGE_URL);
  const buffer = await res.arrayBuffer();
  referenceImageBase64 = Buffer.from(buffer).toString("base64");
  return referenceImageBase64;
}

export async function POST(request: NextRequest) {
  try {
    const { tileId, tileName, tileDescription } = await request.json();

    if (!tileId || !tileName) {
      return NextResponse.json({ error: "Missing tile info" }, { status: 400 });
    }

    const cacheKey = tileId;
    if (imageCache.has(cacheKey)) {
      return NextResponse.json({ image: imageCache.get(cacheKey) });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const refImage = await getReferenceImage();

    const prompt = `Edit this shower image. Keep the EXACT same shower layout, camera angle, lighting, glass enclosure, and gold fixtures. ONLY change the wall tiles to ${tileName} (${tileDescription}).

Rules:
- Keep the same composition, perspective, and framing
- Keep all fixtures (showerhead, controls, niche) in the same position
- ONLY replace the tile texture/pattern on the shower walls
- The new tiles should look photorealistic with proper grout lines, reflections, and shadows
- Maintain the luxury bathroom aesthetic
- Do NOT add text, watermarks, or labels`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: refImage,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          temperature: 0.4,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to generate image", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    const candidates = data.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      return NextResponse.json({ error: "No content in response" }, { status: 500 });
    }

    const imagePart = parts.find(
      (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
    );

    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: "No image data in response" }, { status: 500 });
    }

    const base64Image = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    imageCache.set(cacheKey, base64Image);

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    console.error("Generate tile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
