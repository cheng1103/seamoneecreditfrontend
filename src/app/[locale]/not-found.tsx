'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const lang = locale === 'ms' ? 'ms' : 'en';

  const content = {
    en: {
      title: 'Page Not Found',
      subtitle: "Sorry, we couldn't find the page you're looking for.",
      backHome: 'Back to Home',
      contact: 'Contact Us',
    },
    ms: {
      title: 'Halaman Tidak Dijumpai',
      subtitle: 'Maaf, kami tidak dapat mencari halaman yang anda cari.',
      backHome: 'Kembali ke Utama',
      contact: 'Hubungi Kami',
    },
  };

  const t = content[lang];

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-2xl">
        <div className="wave-grid relative overflow-hidden rounded-[32px] border border-white/70 bg-white/95 p-8 text-center shadow-[0_25px_70px_rgba(8,18,51,0.12)] md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="relative">
            <div className="text-7xl font-semibold text-primary/20 md:text-8xl">404</div>
            <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
              {t.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">{t.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/${locale}`}>{t.backHome}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary"
              >
                <Link href={`/${locale}/contact`}>{t.contact}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
