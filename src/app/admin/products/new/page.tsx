"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FUNNEL_SECTIONS = [
  { key: "titolo", label: "Titolo del Prodotto" },
  { key: "sottotitolo", label: "Sottotitolo" },
  { key: "problema", label: "Problema (la pain point)" },
  { key: "storia", label: "La Tua Storia" },
  { key: "recensioni", label: "Recensioni / Testimonianze" },
  { key: "cta", label: "Call to Action (vendita)" },
];

const LANGUAGES = [
  { code: "it", name: "🇮🇹 Italiano" },
  { code: "en", name: "🇬🇧 English" },
  { code: "es", name: "🇪🇸 Español" },
  { code: "fr", name: "🇫🇷 Français" },
  { code: "de", name: "🇩🇪 Deutsch" },
  { code: "pt", name: "🇧🇷 Português" },
  { code: "nl", name: "🇳🇱 Nederlands" },
  { code: "pl", name: "🇵🇱 Polski" },
  { code: "ru", name: "🇷🇺 Русский" },
  { code: "ja", name: "🇯🇵 日本語" },
  { code: "ko", name: "🇰🇷 한국어" },
  { code: "zh", name: "🇨🇳 中文" },
  { code: "ar", name: "🇸🇦 العربية" },
  { code: "hi", name: "🇮🇳 हिन्दी" },
  { code: "tr", name: "🇹🇷 Türkçe" },
  { code: "vi", name: "🇻🇳 Tiếng Việt" },
  { code: "th", name: "🇹🇭 ไทย" },
  { code: "id", name: "🇮🇩 Bahasa" },
  { code: "sv", name: "🇸🇪 Svenska" },
  { code: "da", name: "🇩🇰 Dansk" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isTranslating, setIsTranslating] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("4900"); // centesimi
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [texts, setTexts] = useState<Record<string, string>>(
    Object.fromEntries(FUNNEL_SECTIONS.map((s) => [s.key, ""]))
  );
  const [lessons, setLessons] = useState<Array<{ title: string; videoUrl: string }>>([
    { title: "", videoUrl: "" },
  ]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLocale: "it",
          targetLocales: LANGUAGES.filter((l) => l.code !== "it").map((l) => l.code),
          sections: texts,
        }),
      });
      const data = await res.json();
      // Qui salveresti le traduzioni nel database
      console.log("Traduzioni ricevute:", data);
      alert("Traduzioni generate! Controlla la console.");
    } catch (err) {
      console.error(err);
      alert("Errore nella traduzione");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          price: parseInt(price),
          coverUrl: coverPreview,
          translations: texts,
          lessons,
          sourceLocale: "it",
        }),
      });
      if (res.ok) {
        alert("Prodotto salvato!");
        router.push("/admin/products");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Nuovo Prodotto</h1>
      <p className="mt-1 text-gray-500">
        Compila i campi in italiano, poi clicca &quot;Traduci con AI&quot; per generare 20 lingue
      </p>

      {/* Copertina */}
      <div className="mt-8 rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Copertina</h2>
        <div className="flex items-start gap-6">
          <div className="h-48 w-32 flex-shrink-0 rounded-lg border-2 border-dashed bg-gray-50 flex items-center justify-center overflow-hidden">
            {coverPreview ? (
              <img src={coverPreview} alt="Copertina" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400">PNG 2:3</span>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="text-sm"
            />
            <p className="mt-2 text-xs text-gray-400">
              Formato consigliato: 600x900px (proporzione 2:3)
            </p>
          </div>
        </div>
      </div>

      {/* Configurazione */}
      <div className="mt-6 rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Configurazione</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="corso-fotografia"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Prezzo (centesimi)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              {parseInt(price) / 100} € — Stripe gestirà valute e tasse
            </p>
          </div>
        </div>
      </div>

      {/* Sezioni del Funnel */}
      <div className="mt-6 rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Contenuti Funnel <span className="text-sm font-normal text-gray-400">(in italiano)</span>
        </h2>
        <div className="flex flex-col gap-4">
          {FUNNEL_SECTIONS.map((section) => (
            <div key={section.key}>
              <label className="block text-sm font-medium">{section.label}</label>
              <textarea
                value={texts[section.key] || ""}
                onChange={(e) =>
                  setTexts((prev) => ({ ...prev, [section.key]: e.target.value }))
                }
                rows={section.key === "storia" || section.key === "recensioni" ? 5 : 2}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                placeholder={`Scrivi il contenuto della sezione "${section.label}"...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lezioni */}
      <div className="mt-6 rounded-lg border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lezioni (Video)</h2>
          <button
            onClick={() => setLessons((prev) => [...prev, { title: "", videoUrl: "" }])}
            className="text-sm text-gray-500 underline"
          >
            + Aggiungi lezione
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {lessons.map((lesson, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                {i + 1}
              </span>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => {
                  const next = [...lessons];
                  next[i].title = e.target.value;
                  setLessons(next);
                }}
                placeholder="Titolo lezione"
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={lesson.videoUrl}
                onChange={(e) => {
                  const next = [...lessons];
                  next[i].videoUrl = e.target.value;
                  setLessons(next);
                }}
                placeholder="URL YouTube"
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          I link YouTube verranno tradotti per lingua nella prossima fase
        </p>
      </div>

      {/* Azioni */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isTranslating ? "Traduzione in corso..." : "Traduci con AI (20 lingue)"}
        </button>
        <button
          onClick={handleSave}
          className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
        >
          Salva Bozza
        </button>
      </div>
    </div>
  );
}
