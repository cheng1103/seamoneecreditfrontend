import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
          <div className="wave-grid relative overflow-hidden rounded-[32px] border border-white/70 bg-white/95 p-8 text-center shadow-[0_25px_70px_rgba(8,18,51,0.12)] md:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="relative">
              <div className="text-7xl font-semibold text-primary/20 md:text-8xl">404</div>
              <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
                Page Not Found
              </h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Sorry, we could not find the page you are looking for.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/en"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
