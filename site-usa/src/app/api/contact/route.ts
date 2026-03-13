import { NextRequest, NextResponse } from "next/server";

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

    const webhookRes = await fetch(
      "https://hooks.iaxlab.top/webhook/a6f0fa75-2ea8-45fa-a708-f49c482214df",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!webhookRes.ok) {
      console.error("Webhook failed:", webhookRes.status);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
