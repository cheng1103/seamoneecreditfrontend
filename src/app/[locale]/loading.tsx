export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="wave-grid relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-8 text-center shadow-[0_25px_60px_rgba(8,18,51,0.12)]">
        <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-14 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-foreground">Loading...</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Preparing the next section for you.
          </p>
        </div>
      </div>
    </div>
  );
}
