'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const lang = locale === 'ms' ? 'ms' : 'en';

  useEffect(() => {
    console.error(error);
  }, [error]);

  const content = {
    en: {
      title: 'Something went wrong',
      subtitle: 'An unexpected error occurred. Please try again.',
      tryAgain: 'Try Again',
      backHome: 'Back to Home',
    },
    ms: {
      title: 'Sesuatu tidak kena',
      subtitle: 'Ralat tidak dijangka berlaku. Sila cuba lagi.',
      tryAgain: 'Cuba Lagi',
      backHome: 'Kembali ke Utama',
    },
  };

  const t = content[lang];

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-2xl">
        <div className="wave-grid relative overflow-hidden rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_25px_70px_rgba(8,18,51,0.12)] md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="relative text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              !
            </div>
            <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">{t.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t.tryAgain}
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary"
              >
                <a href={`/${locale}`}>{t.backHome}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
