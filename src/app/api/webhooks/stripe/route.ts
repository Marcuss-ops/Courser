import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Gestisci il evento checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;
    const locale = session.metadata?.locale;

    if (!userId || !productId) {
      console.error("Missing metadata in session:", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      await prisma.order.create({
        data: {
          userId,
          productId,
          stripeSessionId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || "eur",
          locale: locale || "it",
          status: "completed",
        },
      });

      console.log(`Order created for user ${userId}, product ${productId}`);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  }

  return NextResponse.json({ received: true });
}
