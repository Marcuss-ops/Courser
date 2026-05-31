import fs from 'fs';
import path from 'path';

export interface LessonConfig {
  number: number;
  id: string;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  videos: Record<string, string>;
  duration: string;
}

export interface PriceByLocale {
  amount: number;
  currency: string;
  symbol: string;
}

export interface CourseConfig {
  slug: string;
  productId?: string;
  template?: "lumio" | "h612" | "horizon" | "default";
  defaultLanguage: string;
  cover: string;
  checkoutUrl: string;
  author: string;
  price?: number;
  /** Prezzi localizzati per paese (es. { it: { amount: 19, currency: "EUR", symbol: "€" }, en: { amount: 17, currency: "USD", symbol: "$" } }) */
  prices?: Record<string, PriceByLocale>;
  lemonVariantId?: string; // Lemon Squeezy variant ID (sostituisce Stripe)
  languages: Record<string, {
    title: string;
    problem: string;
    story: string;
    cta: string;
    description: string;
    ebookTitle: string;
    ebookContent: string;
  }>;
  lessons: LessonConfig[];
  ebookChapters: Array<{ it: string; en: string; page: number }>;
}

export function getCourseConfig(slug: string): CourseConfig | null {
  try {
    const configPath = path.join(process.cwd(), 'public', 'courses', slug, 'config.json');
    if (!fs.existsSync(configPath)) {
      return null;
    }
    const fileContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(fileContent) as CourseConfig;
  } catch (error) {
    console.error(`Error reading config for ${slug}:`, error);
    return null;
  }
}
