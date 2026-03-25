import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://hooks.iaxlab.top/webhook/groutabout-lead";
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/groutaboutbathroom-info/30min";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      description: body.description || "",
      expectedStartDate: body.expectedStartDate || "",
      howFoundUs: body.howFoundUs || "",
      submittedAt: new Date().toISOString(),
    };

    const webhookRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      console.error("Webhook failed:", webhookRes.status);
    }

    // Build Calendly URL with pre-filled params
    let calendlyUrl = "";
    if (CALENDLY_URL) {
      const params = new URLSearchParams({
        name: `${firstName} ${lastName}`,
        email,
        a1: phone,
      });
      calendlyUrl = `${CALENDLY_URL}?${params.toString()}`;
    }

    return NextResponse.json({ success: true, calendlyUrl });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
