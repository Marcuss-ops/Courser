"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateSelector from "@/components/admin/template-selector";
import type { TemplateId } from "@/components/funnel";

const FUNNEL_SECTIONS = [
  { key: "titolo", label: "Titolo del Prodotto", placeholder: "Es: Corso Completo di Fotografia" },
  { key: "sottotitolo", label: "Sottotitolo", placeholder: "Es: Impara a scattare foto professionali in 30 giorni" },
  { key: "problema", label: "Problema (pain point)", placeholder: "Es: Sei stanco di scattare foto sfocate e scure?" },
  { key: "storia", label: "La Tua Storia", placeholder: "Es: Ho iniziato a scattare foto a 15 anni...\nDopo 20 anni di esperienza..." },
  { key: "recensioni", label: "Recensioni / Testimonianze", placeholder: "Es: Finalmente scatto foto che mi fanno orgoglio! — Marco, Roma" },
  { key: "cta", label: "Call to Action (vendita)", placeholder: "Es: Inizia Oggi — Accesso a Vita" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState<"template" | "content" | "ai">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("4900");
  const [texts, setTexts] = useState<Record<string, string>>(
    Object.fromEntries(FUNNEL_SECTIONS.map((s) => [s.key, ""]))
  );
  const [lessons, setLessons] = useState<Array<{ title: string; videoUrl: string }>>([
    { title: "", videoUrl: "" },
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Step 1: Template selection
  const handleTemplateSelect = (templateId: TemplateId, domain: string) => {
    setSelectedTemplate(templateId);
    setSlug(domain);
    setStep("content");
  };

  // Step 3: AI modification
  const handleAiModify = async () => {
    if (!aiPrompt.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLocale: "it",
          targetLocales: ["it"],
          sections: { custom: aiPrompt },
          mode: "rewrite",
          currentTexts: texts,
        }),
      });
      const data = await res.json();
      setAiResult(JSON.stringify(data, null, 2));
    } catch {
      alert("Errore nella richiesta AI");
    } finally {
      setIsTranslating(false);
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
          targetLocales: ["en", "es", "fr", "de", "pt"],
          sections: texts,
        }),
      });
      const data = await res.json();
      console.log("Traduzioni:", data);
      alert("Traduzioni generate! Controlla la console.");
    } catch {
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
          templateId: selectedTemplate,
        }),
      });
      if (res.ok) {
        alert("Prodotto salvato!");
        router.push("/admin/products");
      }
    } catch {
      alert("Errore nel salvataggio");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-3">
        {[
          { key: "template", label: "1. Template" },
          { key: "content", label: "2. Contenuti" },
          { key: "ai", label: "3. AI & Traduzioni" },
        ].map((s) => (
          <div
            key={s.key}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
              step === s.key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* STEP 1: Template Selection */}
      {step === "template" && (
        <div>
          <h1 className="text-2xl font-bold">Scegli il Template</h1>
          <p className="mt-1 text-gray-500">
            Seleziona un design white-label per il tuo prodotto
          </p>
          <TemplateSelector
            onSelect={handleTemplateSelect}
            onClose={() => router.push("/admin")}
          />
        </div>
      )}

      {/* STEP 2: Content */}
      {step === "content" && (
        <div>
          <h1 className="text-2xl font-bold">Contenuti del Funnel</h1>
          <p className="mt-1 text-gray-500">
            Template: <strong>{selectedTemplate}</strong> — Slug: <strong>/{slug}</strong>
          </p>

          {/* Copertina */}
          <div className="mt-6 rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Copertina</h2>
            <div className="flex items-start gap-6">
              <div className="flex h-48 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-gray-50">
                {coverPreview ? (
                  <img src={coverPreview} alt="Copertina" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">PNG 2:3</span>
                )}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} className="text-sm" />
                <p className="mt-2 text-xs text-gray-400">600×900px consigliato</p>
              </div>
            </div>
          </div>

          {/* Sezioni del Funnel */}
          <div className="mt-6 rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">
              Testi della Landing Page <span className="text-sm font-normal text-gray-400">(in italiano)</span>
            </h2>
            <div className="flex flex-col gap-4">
              {FUNNEL_SECTIONS.map((section) => (
                <div key={section.key}>
                  <label className="block text-sm font-medium">{section.label}</label>
                  <textarea
                    value={texts[section.key] || ""}
                    onChange={(e) => setTexts((prev) => ({ ...prev, [section.key]: e.target.value }))}
                    rows={section.key === "storia" || section.key === "recensioni" ? 4 : 2}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    placeholder={section.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lezioni */}
          <div className="mt-6 rounded-xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Lezioni (Video YouTube)</h2>
              <button
                onClick={() => setLessons((prev) => [...prev, { title: "", videoUrl: "" }])}
                className="text-sm text-gray-500 underline"
              >
                + Aggiungi lezione
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {lessons.map((lesson, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => { const n = [...lessons]; n[i].title = e.target.value; setLessons(n); }}
                    placeholder="Titolo lezione"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={lesson.videoUrl}
                    onChange={(e) => { const n = [...lessons]; n[i].videoUrl = e.target.value; setLessons(n); }}
                    placeholder="URL YouTube"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Configurazione */}
          <div className="mt-6 rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Configurazione</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Prezzo (centesimi)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">{parseInt(price) / 100} €</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("ai")}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Continua → Modifica con AI
            </button>
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Traduci in 5 Lingue
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-gray-50"
            >
              Salva Bozza
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI Modification */}
      {step === "ai" && (
        <div>
          <h1 className="text-2xl font-bold">Modifica con AI</h1>
          <p className="mt-1 text-gray-500">
            Scrivi cosa vuoi cambiare e l&apos;AI riscriverà i testi del funnel
          </p>

          {/* AI Prompt */}
          <div className="mt-6 rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Cosa vuoi modificare?</h2>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Esempi:
- Rendi il testo più urgente e persuasivo
- Aggiungi un tono più informale e amichevole
- Trasforma la storia in un racconto emozionante
- Riscrivi le recensioni in modo più naturale
- Cambia il CTA per renderlo più irresistibile"
            />
            <button
              onClick={handleAiModify}
              disabled={isTranslating || !aiPrompt.trim()}
              className="mt-4 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {isTranslating ? "L&apos;AI sta lavorando..." : "✨ Modifica con AI"}
            </button>
          </div>

          {/* AI Result */}
          {aiResult && (
            <div className="mt-6 rounded-xl border bg-gray-50 p-6">
              <h2 className="mb-4 font-semibold">Risultato AI</h2>
              <pre className="overflow-auto text-sm text-gray-700">{aiResult}</pre>
              <button
                onClick={() => {
                  // Applica le modifiche ai testi
                  try {
                    const parsed = JSON.parse(aiResult);
                    if (parsed.translations?.it) {
                      setTexts((prev) => ({ ...prev, ...parsed.translations.it }));
                    }
                    alert("Modifiche applicate!");
                  } catch {
                    // Ignora
                  }
                }}
                className="mt-4 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
              >
                Applica Modifiche
              </button>
            </div>
          )}

          {/* Current texts preview */}
          <div className="mt-6 rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Anteprima Testi Attuali</h2>
            <div className="flex flex-col gap-3">
              {FUNNEL_SECTIONS.map((section) => (
                <div key={section.key}>
                  <p className="text-xs font-medium text-gray-400">{section.label}</p>
                  <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                    {texts[section.key] || <span className="italic text-gray-300">Non compilato</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("content")}
              className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-gray-50"
            >
              ← Indietro
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700"
            >
              Salva e Pubblica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
