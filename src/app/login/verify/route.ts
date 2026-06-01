import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

async function getProductSlug(productId: string): Promise<string | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });
    return product?.slug || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const productId = searchParams.get("productId");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", request.url));
  }

  // Verifica il magic link
  const magicLink = await prisma.magicLink.findUnique({ where: { token } });

  if (!magicLink || magicLink.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", request.url));
  }

  // Segna il magic link come usato
  if (!magicLink.used) {
    await prisma.magicLink.update({ where: { id: magicLink.id }, data: { used: true } });
  }

  // Crea o trova utente
  let user = await prisma.user.findUnique({ where: { email: magicLink.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: magicLink.email,
        name: magicLink.email.split("@")[0],
        role: "student",
      },
    });
  }

  // ─── Crea sessione NextAuth persistente ─────────────────────
  const sessionToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 giorni

  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("next-auth.session-token", sessionToken, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // ─── Redirect al corso o all'admin/dashboard ────────────
  const targetProductId = productId || magicLink.productId;
  if (targetProductId) {
    const targetSlug = await getProductSlug(targetProductId);
    if (targetSlug) {
      return NextResponse.redirect(new URL(`/${targetSlug}/curso/lesson-1?lang=it`, request.url));
    }
  }

  // Se l'utente è un admin, redirect alla dashboard admin
  if (user.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Altrimenti alla home
  return NextResponse.redirect(new URL("/", request.url));
}
