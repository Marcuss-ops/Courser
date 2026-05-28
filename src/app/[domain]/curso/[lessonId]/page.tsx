import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ domain: string; lessonId: string }>;
}) {
  const { domain, lessonId } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: domain },
    include: {
      lessons: {
        orderBy: { position: "asc" },
        include: { translations: true },
      },
    },
  });

  if (!product) notFound();

  const currentLesson = product.lessons.find((l) => l.id === lessonId);
  if (!currentLesson) notFound();

  // Prendi la traduzione base (it) della lezione
  const lessonTranslation =
    currentLesson.translations.find((t) => t.locale === "it") ||
    currentLesson.translations[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <Link href={`/${domain}`} className="text-sm text-gray-400 hover:text-white">
          ← Torna al corso
        </Link>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 p-6">
        {/* Sidebar lezioni */}
        <aside className="w-64 flex-shrink-0">
          <h3 className="mb-3 text-sm font-semibold text-gray-400">Lezioni</h3>
          <nav className="flex flex-col gap-1">
            {product.lessons.map((lesson) => {
              const trans =
                lesson.translations.find((t) => t.locale === "it") ||
                lesson.translations[0];
              const isActive = lesson.id === lessonId;
              return (
                <Link
                  key={lesson.id}
                  href={`/${domain}/curso/${lesson.id}`}
                  className={`rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  {lesson.position}. {trans?.title || `Lezione ${lesson.position}`}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Contenuto lezione */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold">
            {lessonTranslation?.title || `Lezione ${currentLesson.position}`}
          </h1>

          {/* Player video YouTube */}
          {lessonTranslation?.videoUrl && (
            <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={lessonTranslation.videoUrl.replace("watch?v=", "embed/")}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Descrizione lezione */}
          {lessonTranslation?.description && (
            <div className="mt-6 rounded-lg bg-gray-900 p-6">
              <p className="whitespace-pre-line text-gray-300">
                {lessonTranslation.description}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
