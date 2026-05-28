import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, productId, metadata, userId } = body;

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    const event = await prisma.analyticEvent.create({
      data: {
        eventType,
        productId: productId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        userId: userId || null,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("POST /api/analytics error:", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
