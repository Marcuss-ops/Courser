export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold">Demo Corso</span>
          <div className="flex gap-2 text-sm text-gray-500">
            <span className="font-bold text-gray-900">IT</span>
            <span>EN</span>
            <span>ES</span>
          </div>
        </div>
      </header>

      {/* Problema */}
      <section className="bg-red-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-red-900">
            Sei stanco di bruciare la cena ogni sera?
          </h2>
          <p className="mt-4 text-lg text-red-700">
            Il 73% delle persone desidera cucinare meglio ma non sa da dove iniziare.
          </p>
        </div>
      </section>

      {/* Storia */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-start gap-8">
            <div className="h-64 w-44 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
              PNG
            </div>
            <div>
              <h2 className="text-2xl font-bold">La Mia Storia</h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                Ho iniziato a cucinare a 10 anni, in una piccola cucina di campagna.
                Dopo 20 anni di esperienza, ho raccolto le ricette e le tecniche
                che funzionano davvero per chi parte da zero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recensioni */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-8 text-2xl font-bold">Cosa Dicono gli Studenti</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 text-left shadow-sm">
              <p className="text-gray-600">
                &ldquo;Finalmente cucino qualcosa di buono per la mia famiglia!&rdquo;
              </p>
              <p className="mt-2 text-sm text-gray-400">— Marco, Roma</p>
            </div>
            <div className="rounded-lg bg-white p-6 text-left shadow-sm">
              <p className="text-gray-600">
                &ldquo;Semplice, pratico, senza pipponi. Consigliatissimo.&rdquo;
              </p>
              <p className="mt-2 text-sm text-gray-400">— Laura, Milano</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">Inizia Oggi Stesso</h2>
          <p className="mb-8 text-lg text-gray-300">
            Prezzo: €49,00 — Accesso a vita
          </p>
          <button className="rounded-lg bg-white px-8 py-4 text-lg font-bold text-gray-900 transition hover:bg-gray-100">
            Acquista Ora
          </button>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-gray-400">
        © 2026 Demo Corso. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
