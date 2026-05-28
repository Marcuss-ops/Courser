import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">Courser</h1>
        <p className="mt-4 text-xl text-gray-500">
          Il Cervellone — Generatore automatico di Funnel multilingua
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary px-6 py-3 text-white transition hover:opacity-90 shadow-lg"
        >
          Il Mio Corso
        </Link>
        <Link
          href="/admin"
          className="rounded-lg bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-700"
        >
          Dashboard Admin
        </Link>
        <Link
          href="/demo"
          className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-50"
        >
          Demo Templates
        </Link>
      </div>

      <div className="mt-8 grid max-w-4xl grid-cols-1 gap-6 text-left md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-xl">☀️</div>
          <h3 className="font-semibold">Lumio</h3>
          <p className="mt-1 text-sm text-gray-500">
            Minimalismo + Glassmorphism, ivory calda, gradienti sunset
          </p>
          <Link href="/demo/lumio" className="mt-3 inline-block text-sm text-gray-900 underline">
            Vedi Demo →
          </Link>
        </div>
        <div className="rounded-xl border p-5">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">🌑</div>
          <h3 className="font-semibold">Obsidian Scholar</h3>
          <p className="mt-1 text-sm text-gray-500">
            Dark monochrome, tonal layering, serif + sans, liquid orbs
          </p>
          <Link href="/demo/h612" className="mt-3 inline-block text-sm text-gray-900 underline">
            Vedi Demo →
          </Link>
        </div>
        <div className="rounded-xl border p-5">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">🌅</div>
          <h3 className="font-semibold">Horizon</h3>
          <p className="mt-1 text-sm text-gray-500">
            Airy minimalism, glassmorphism, gradienti atmosferici, cursor glow
          </p>
          <Link href="/demo/horizon" className="mt-3 inline-block text-sm text-gray-900 underline">
            Vedi Demo →
          </Link>
        </div>
      </div>

      <div className="mt-4 grid max-w-4xl grid-cols-1 gap-4 text-left md:grid-cols-3">
        <div className="rounded-xl border border-dashed p-4">
          <h3 className="font-semibold">1. Inserisci</h3>
          <p className="mt-1 text-sm text-gray-500">
            Scegli un template, carica il PNG, scrivi i testi in italiano
          </p>
        </div>
        <div className="rounded-xl border border-dashed p-4">
          <h3 className="font-semibold">2. Modifica con AI</h3>
          <p className="mt-1 text-sm text-gray-500">
            L&apos;AI riscrive i testi, li traduce in 20 lingue, li salva nel DB
          </p>
        </div>
        <div className="rounded-xl border border-dashed p-4">
          <h3 className="font-semibold">3. Pubblica</h3>
          <p className="mt-1 text-sm text-gray-500">
            Il funnel è online, lo Stripe è collegato, le vendite partono da solo
          </p>
        </div>
      </div>
    </div>
  );
}
