export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-hanken flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 premium-glass rounded-full flex items-center justify-center border border-white/10">
          <div className="w-6 h-6 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
        </div>
        <p className="text-sm font-medium text-zinc-500">Caricamento in corso...</p>
      </div>
    </div>
  );
}
