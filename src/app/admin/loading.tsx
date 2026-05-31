export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-sm text-zinc-500 font-medium">Caricamento dashboard...</p>
      </div>
    </div>
  );
}
