import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { initLS, getStoreId } from "@/lib/lemonsqueezy";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { productId, locale = "it", channelId } = body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Validate at least one payment provider is configured
    if (!product.lemonVariantId && !product.stripePriceId) {
      return NextResponse.json(
        { error: "Nessun metodo di pagamento configurato per questo prodotto. Aggiungi un Lemon Variant ID o uno Stripe Price ID." },
        { status: 400 }
      );
    }

    const userEmail = session?.user?.email || body.email || "";

    // ─── Priority 1: Lemon Squeezy (if lemonVariantId is set) ──
    if (product.lemonVariantId) {
      const storeId = product.lemonStoreId || getStoreId();
      if (!storeId) {
        return NextResponse.json(
          { error: "Lemon Squeezy store not configured. Set LEMONSQUEEZY_STORE_ID in .env or lemonStoreId on the product." },
          { status: 500 }
        );
      }

      initLS();

      const variantId = parseInt(product.lemonVariantId, 10);
      if (isNaN(variantId)) {
        return NextResponse.json({ error: "Invalid lemonVariantId" }, { status: 500 });
      }

      const customData: Record<string, string> = {
        courseSlug: product.slug,
        locale,
      };
      if (userEmail) customData.email = userEmail;
      if (channelId) customData.channelId = channelId;

      const checkout = await createCheckout(storeId, variantId, {
        checkoutData: {
          email: userEmail || undefined,
          custom: customData,
        },
        productOptions: {
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${product.slug}?success=1`,
          receiptButtonText: "Accedi al Corso",
          receiptLinkUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${product.slug}/curso/lesson-1?lang=${locale}`,
        },
        // Prevent multiple checkouts for the same variant
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
      });

      if (checkout.error || !checkout.data) {
        console.error("LS checkout error:", checkout.error);
        return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
      }

      return NextResponse.json({ url: checkout.data.data.attributes.url });
    }

    // ─── Fallback: Stripe (legacy) ────────────────────────────
    const { getStripe } = await import("@/lib/stripe");
    const user = userEmail
      ? await prisma.user.findUnique({ where: { email: userEmail } })
      : null;

    const stripeSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: product.stripePriceId || undefined,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${product.slug}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${product.slug}?canceled=1`,
      metadata: {
        userId: user?.id || "guest",
        productId: product.id,
        locale,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
