"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-hanken flex items-center justify-center p-6">
      <div className="premium-glass p-12 rounded-[2rem] text-center max-w-md space-y-6 border border-white/10">
        <div className="w-20 h-20 premium-glass rounded-full flex items-center justify-center mx-auto border border-red-500/30">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-black text-white text-contrast">Qualcosa è andato storto</h2>
        <p className="text-zinc-500 text-sm font-medium">
          Si è verificato un errore imprevisto. Il nostro team è stato notificato.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="glow-btn w-full py-4 rounded-2xl text-sm font-bold text-white premium-glass"
          >
            Riprova
          </button>
          <Link
            href="/"
            className="w-full py-4 premium-glass rounded-2xl text-sm font-bold text-zinc-300 hover:text-white transition border border-white/5"
          >
            Torna alla Home
          </Link>
        </div>
        <p className="text-[10px] text-zinc-700 font-mono">
          {error.digest ? `ID errore: ${error.digest}` : error.message?.slice(0, 100)}
        </p>
      </div>
    </div>
  );
}
