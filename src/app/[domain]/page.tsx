import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

// ─── Genera i path per tutti i dominio/slugs ─────────────
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return products.map((p) => ({ domain: p.slug }));
}

// ─── Pagina Funnel Dinamica ────────────────────────────────
// Legge il dominio/slug dall'URL e carica i testi dal DB
export default async function FunnelPage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { domain } = await params;
  const { lang } = await searchParams;
  const locale = lang || "it";

  // Cerca il prodotto nello slug
  const product = await prisma.product.findUnique({
    where: { slug: domain },
    include: {
      translations: { where: { locale } },
    },
  });

  if (!product) notFound();

  // Helper: prendi il testo di una sezione
  const getText = (section: string) =>
    product.translations.find((t) => t.section === section)?.content || "";

  return (
    <div className="min-h-screen bg-white">
      {/* ── HEADER / NAV ────────────────────────────────── */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold">{getText("titolo") || domain}</span>
          <div className="flex gap-2 text-sm text-gray-500">
            <a href={`?lang=it`} className={locale === "it" ? "font-bold text-gray-900" : ""}>IT</a>
            <a href={`?lang=en`} className={locale === "en" ? "font-bold text-gray-900" : ""}>EN</a>
            <a href={`?lang=es`} className={locale === "es" ? "font-bold text-gray-900" : ""}>ES</a>
            <a href={`?lang=fr`} className={locale === "fr" ? "font-bold text-gray-900" : ""}>FR</a>
            <a href={`?lang=de`} className={locale === "de" ? "font-bold text-gray-900" : ""}>DE</a>
          </div>
        </div>
      </header>

      {/* ── SEZIONE PROBLEMA ────────────────────────────── */}
      {getText("problema") && (
        <section className="bg-red-50 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold text-red-900">{getText("problema")}</h2>
          </div>
        </section>
      )}

      {/* ── SEZIONE STORIA ──────────────────────────────── */}
      {getText("storia") && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex items-start gap-8">
              {product.coverUrl && (
                <img
                  src={product.coverUrl}
                  alt={getText("titolo")}
                  className="h-64 w-44 flex-shrink-0 rounded-lg object-cover shadow-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{getText("sottotitolo")}</h2>
                <p className="mt-4 leading-relaxed text-gray-600 whitespace-pre-line">
                  {getText("storia")}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SEZIONE RECENSIONI ───────────────────────────── */}
      {getText("recensioni") && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-8 text-2xl font-bold">Cosa Dicono gli Studenti</h2>
            <p className="text-gray-600 whitespace-pre-line">{getText("recensioni")}</p>
          </div>
        </section>
      )}

      {/* ── CTA / VENDITA ────────────────────────────────── */}
      {getText("cta") && (
        <section className="bg-gray-900 py-16 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold">{getText("cta")}</h2>
            <p className="mb-8 text-lg text-gray-300">
              Prezzo: {(product.price / 100).toFixed(2)} {product.currency.toUpperCase()}
            </p>
            <button className="rounded-lg bg-white px-8 py-4 text-lg font-bold text-gray-900 transition hover:bg-gray-100">
              Acquista Ora
            </button>
          </div>
        </section>
      )}

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {getText("titolo") || domain}. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
