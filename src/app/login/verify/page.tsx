import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { randomBytes } from "crypto";
import { CheckCircle2, XCircle } from "lucide-react";

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

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; productId?: string }>;
}) {
  const { token, productId } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-hanken flex items-center justify-center p-6">
        <div className="premium-glass p-12 rounded-[2rem] text-center max-w-md space-y-6 border border-white/10">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Token Mancante</h2>
          <p className="text-zinc-500 text-sm">Nessun token di verifica fornito.</p>
          <Link href="/login" className="glow-btn inline-block px-8 py-3 rounded-2xl text-sm font-bold text-white premium-glass">
            Torna al Login
          </Link>
        </div>
      </div>
    );
  }

  // Verifica il magic link
  const magicLink = await prisma.magicLink.findUnique({ where: { token } });

  if (!magicLink || magicLink.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-hanken flex items-center justify-center p-6">
        <div className="premium-glass p-12 rounded-[2rem] text-center max-w-md space-y-6 border border-white/10">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Link Non Valido o Scaduto</h2>
          <p className="text-zinc-500 text-sm">Questo link è scaduto o non esiste.</p>
          <Link href="/login" className="glow-btn inline-block px-8 py-3 rounded-2xl text-sm font-bold text-white premium-glass">
            Richiedi Nuovo Link
          </Link>
        </div>
      </div>
    );
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

  // ─── Redirect al corso (usa lo slug, non l'ID) ────────────
  const targetProductId = productId || magicLink.productId;
  if (targetProductId) {
    const targetSlug = await getProductSlug(targetProductId);
    if (targetSlug) {
      redirect(`/${targetSlug}/curso/lesson-1?lang=it`);
    }
    // Fallback: redirect to login page if we can't resolve the slug
    redirect(`/login?error=redirect_failed`);
  }

  // Fallback: mostra la pagina di successo
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-hanken flex items-center justify-center p-6">
      <div className="premium-glass p-12 rounded-[2rem] text-center max-w-md space-y-8 border border-white/10">
        <div className="w-20 h-20 premium-glass rounded-full flex items-center justify-center mx-auto border border-accent-tertiary/30">
          <CheckCircle2 className="w-10 h-10 text-accent-tertiary" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-white text-contrast">Accesso Verificato!</h2>
          <p className="text-zinc-500 text-sm font-medium">
            Ciao <strong className="text-white">{magicLink.email}</strong>, il tuo accesso è stato confermato.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="glow-btn w-full py-4 rounded-2xl text-sm font-bold text-white premium-glass"
          >
            Vai alla Home
          </Link>
          <Link
            href="/login"
            className="w-full py-4 premium-glass rounded-2xl text-sm font-bold text-zinc-300 hover:text-white transition border border-white/5"
          >
            Torna al Login
          </Link>
        </div>
      </div>
    </div>
  );
}
