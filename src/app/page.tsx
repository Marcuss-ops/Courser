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
          href="/admin"
          className="rounded-lg bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-700"
        >
          Dashboard Admin
        </Link>
        <Link
          href="/demo"
          className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-50"
        >
          Demo Pubblica
        </Link>
      </div>

      <div className="mt-8 grid max-w-3xl grid-cols-1 gap-6 text-left md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">1. Inserisci</h3>
          <p className="mt-1 text-sm text-gray-500">
            Carica il PNG, scrivi i testi in italiano, aggiungi i link YouTube
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">2. Traduci</h3>
          <p className="mt-1 text-sm text-gray-500">
            Clicca &quot;Traduci con AI&quot; — il cervellone genera 20 lingue in automatico
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">3. Pubblica</h3>
          <p className="mt-1 text-sm text-gray-500">
            Il funnel è online, lo Stripe è collegato, le vendite partono da solo
          </p>
        </div>
      </div>
    </div>
  );
}
