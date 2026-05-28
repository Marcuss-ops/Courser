import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Lista tutti i prodotti
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        translations: { select: { locale: true } },
        _count: { select: { lessons: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Formatta per la response
    const formatted = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      price: p.price,
      currency: p.currency,
      status: p.status,
      coverUrl: p.coverUrl,
      lessonsCount: p._count.lessons,
      locales: Array.from(new Set(p.translations.map((t: { locale: string }) => t.locale))),
      createdAt: p.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST — Crea un nuovo prodotto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, price, coverUrl, translations, lessons, sourceLocale } = body;

    if (!slug || !translations) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Crea prodotto + traduzioni in una transazione
    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          slug,
          price: price || 0,
          coverUrl: coverUrl || null,
          status: "draft",
        },
      });

      // Salva le traduzioni (solo la lingua sorgente per ora)
      for (const [section, content] of Object.entries(translations) as [
        string,
        string
      ][]) {
        if (content && content.trim() !== "") {
          await tx.productTranslation.create({
            data: {
              productId: p.id,
              locale: sourceLocale || "it",
              section,
              content,
            },
          });
        }
      }

      // Salva le lezioni
      if (lessons && Array.isArray(lessons)) {
        for (let i = 0; i < lessons.length; i++) {
          const lesson = lessons[i];
          if (lesson.title) {
            const l = await tx.lesson.create({
              data: {
                productId: p.id,
                position: i + 1,
              },
            });

            await tx.lessonTranslation.create({
              data: {
                lessonId: l.id,
                locale: sourceLocale || "it",
                title: lesson.title,
                videoUrl: lesson.videoUrl || null,
              },
            });
          }
        }
      }

      return p;
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
