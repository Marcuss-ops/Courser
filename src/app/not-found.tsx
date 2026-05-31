import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-hanken flex items-center justify-center p-6">
      <div className="premium-glass p-12 rounded-[2rem] text-center max-w-md space-y-6 border border-white/10">
        <div className="w-20 h-20 premium-glass rounded-full flex items-center justify-center mx-auto border border-zinc-700/50">
          <span className="text-4xl">🔍</span>
        </div>
        <h2 className="text-2xl font-black text-white text-contrast">Pagina non trovata</h2>
        <p className="text-zinc-500 text-sm font-medium">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link
          href="/"
          className="glow-btn inline-block w-full py-4 rounded-2xl text-sm font-bold text-white premium-glass"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
