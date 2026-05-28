import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TEMPLATES, type TemplateId } from "@/components/funnel";
import TemplateLumio from "@/components/funnel/template-lumio";
import TemplateH612 from "@/components/funnel/template-h612";
import TemplateHorizon from "@/components/funnel/template-horizon";

const TEMPLATE_MAP = {
  lumio: TemplateLumio,
  h612: TemplateH612,
  horizon: TemplateHorizon,
};

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
      lessons: {
        orderBy: { position: "asc" },
        include: {
          translations: { where: { locale } },
        },
      },
    },
  });

  if (!product) notFound();

  // Prendi il template dal metadata (per ora default a "lumio")
  // In futuro: product.templateId
  const templateId: TemplateId = "lumio";
  const TemplateComponent = TEMPLATE_MAP[templateId] || TemplateLumio;

  // Costruisci i dati per il template
  const getTranslation = (section: string) =>
    product.translations.find((t: { section: string }) => t.section === section)?.content || "";

  const templateData = {
    titolo: getTranslation("titolo"),
    sottotitolo: getTranslation("sottotitolo"),
    problema: getTranslation("problema"),
    storia: getTranslation("storia"),
    recensioni: getTranslation("recensioni"),
    cta: getTranslation("cta"),
    prezzo: product.price > 0 ? `${(product.price / 100).toFixed(2)} ${product.currency.toUpperCase()}` : undefined,
    coverUrl: product.coverUrl || undefined,
    lezioni: product.lessons.map((lesson: { translations: Array<{ title: string; description: string }> }) => {
      const trans = lesson.translations[0];
      return {
        titolo: trans?.title || "",
        descrizione: trans?.description || "",
      };
    }).filter((l: { titolo: string }) => l.titolo),
  };

  return <TemplateComponent data={templateData} locale={locale} />;
}
