import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Lingue supportate dal Cervellone ────────────────────────
export const SUPPORTED_LOCALES = [
  "it", "en", "es", "fr", "de", "pt", "nl", "pl",
  "ru", "ja", "ko", "zh", "ar", "hi", "tr", "vi",
  "th", "id", "sv", "da",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "it";

// ─── Traduzione automatica via GPT ──────────────────────────
export async function translateContent(
  text: string,
  sourceLocale: Locale,
  targetLocales: Locale[]
): Promise<Record<Locale, string>> {
  const results: Partial<Record<Locale, string>> = {};

  // Traduci in batch per risparmiare chiamate
  const prompt = `Sei un traduttore professionale. Traduci il following testo nelle lingue richieste.
Mantieni lo stesso tono e stile. Restituisci un oggetto JSON dove le chiavi sono i codici lingua.

Testo originale (${sourceLocale}):
${text}

Lingue target: ${targetLocales.join(", ")}

Rispondi SOLO con il JSON valido, senza markdown.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty translation response");

  const translations = JSON.parse(content) as Record<string, string>;

  for (const locale of targetLocales) {
    if (translations[locale]) {
      results[locale] = translations[locale];
    }
  }

  return results as Record<Locale, string>;
}
