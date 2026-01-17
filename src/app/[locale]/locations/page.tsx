import { Metadata } from 'next';
import { baseUrl } from '@/lib/site';
import Link from 'next/link';
import { MapPin, Phone, Clock, Navigation, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbSchema, LocationsListSchema } from '@/components/seo/StructuredData';
import { getLocations } from '@/lib/server/locations';

const SUPPORTED_LOCALES = ['en', 'ms'] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

const resolveValue = (
  value: { en?: string; ms?: string } | undefined,
  locale: string,
  fallback = ''
) => {
  if (!value) return fallback;
  return locale === 'ms' ? value.ms || value.en || fallback : value.en || value.ms || fallback;
};

const getMapsLink = (slug: string, locale: string, geo?: { lat?: number; lng?: number }, fallback?: string) => {
  if (geo?.lat && geo?.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}`;
  }
  if (fallback) {
    return fallback;
  }
  return `${baseUrl}/${locale}/locations/${slug}`;
};

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === 'ms' ? 'ms' : 'en';
  const title =
    lang === 'ms'
      ? 'Cawangan SeaMoneeCredit di Seluruh Malaysia'
      : 'SeaMoneeCredit Branches Across Malaysia';
  const description =
    lang === 'ms'
      ? 'Lihat lokasi SeaMoneeCredit di Kuala Lumpur, Pulau Pinang, dan bandar utama lain. Setiap cawangan menawarkan konsultasi pinjaman tempatan dan sokongan dalam Bahasa Melayu serta Inggeris.'
      : 'Explore SeaMoneeCredit locations in Kuala Lumpur, Penang, and major Malaysian cities. Every branch offers local lending consultations with bilingual support.';
  const url = `${baseUrl}/${locale}/locations`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  };
}

export default async function LocationsPage({ params }: Props) {
  const { locale } = await params;
  const lang = locale === 'ms' ? 'ms' : 'en';
  const locationEntries = await getLocations();
  const heroTitle =
    lang === 'ms'
      ? 'Temui cawangan SeaMoneeCredit berhampiran anda'
      : 'Find a SeaMoneeCredit branch near you';
  const heroSubtitle =
    lang === 'ms'
      ? 'Jumpa pegawai pinjaman berlesen kami secara bersemuka atau jadualkan sesi maya dengan pasukan lokasi pilihan anda.'
      : 'Meet our licensed loan specialists in person or schedule a virtual session with your preferred branch.';
  const coverageTitle =
    lang === 'ms' ? 'Liputan seluruh negara' : 'Nationwide coverage';
  const coverageDescription =
    lang === 'ms'
      ? 'Pasukan tempatan kami menyokong pelanggan di Lembah Klang, Pantai Utara, serta permintaan jarak jauh di seluruh Malaysia.'
      : 'Our local teams assist borrowers throughout the Klang Valley, Northern corridor, and remote applications nationwide.';

  const breadcrumbItems = [
    { name: lang === 'ms' ? 'Utama' : 'Home', url: `${baseUrl}/${locale}` },
    { name: lang === 'ms' ? 'Lokasi' : 'Locations', url: `${baseUrl}/${locale}/locations` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocationsListSchema locale={locale} entries={locationEntries} />
      <section className="hero-surface relative overflow-hidden py-16 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">
            SeaMoneeCredit • Malaysia
          </p>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{heroTitle}</h1>
          <p className="mt-4 text-lg text-white/85">{heroSubtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/${locale}/apply`}>
                {lang === 'ms' ? 'Mohon sekarang' : 'Apply now'}
              </Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white/60 hover:bg-white/10">
              <Link href={`/${locale}/contact`}>
                {lang === 'ms' ? 'Hubungi pakar' : 'Talk to a specialist'}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container -mt-12 pb-16 space-y-12">
        <div className="wave-grid grid gap-6 rounded-[32px] border border-border bg-white p-6 shadow-sm md:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary/80">{coverageTitle}</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">
              {lang === 'ms' ? 'Penasihat pinjaman tempatan' : 'Local lending advisors'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{coverageDescription}</p>
            <ul className="mt-5 grid gap-3 text-sm text-foreground sm:grid-cols-2">
              {locationEntries.map((location) => (
                <li key={location.slug} className="flex items-start gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span>{resolveValue(location.name, locale)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border border-primary/20 px-3 py-1 text-primary">
            {locationEntries.length} {lang === 'ms' ? 'cawangan' : 'branches'}
              </span>
              <span className="rounded-full border border-primary/20 px-3 py-1 text-primary">
                {lang === 'ms' ? 'Sokongan dwibahasa' : 'Bilingual support'}
              </span>
              <span className="rounded-full border border-primary/20 px-3 py-1 text-primary">
                {lang === 'ms' ? 'Temujanji hari sama' : 'Same-day appointments'}
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-5 shadow">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border">
              <iframe
                src={locationEntries[0]?.mapEmbedUrl}
                title="SeaMoneeCredit Malaysia map"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {lang === 'ms'
                ? 'Peta HQ Kuala Lumpur (boleh diperluas di setiap halaman lokasi).'
                : 'Kuala Lumpur HQ map overview (each city page contains a dedicated map).'}
            </p>
          </div>
        </div>

        <section className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
              {lang === 'ms' ? 'Lokasi di Malaysia' : 'Malaysian locations'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              {lang === 'ms'
                ? 'Pilih cawangan yang paling dekat dengan anda'
                : 'Choose the branch that serves you best'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === 'ms'
                ? 'Setiap pusat menawarkan konsultasi percuma, status permohonan masa nyata, dan laluan WhatsApp terus.'
                : 'Each hub offers free consultations, real-time application updates, and direct WhatsApp lines.'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {locationEntries.map((location) => {
              const summary = resolveValue(location.summary, locale);
              const address = resolveValue(location.address, locale);
              const hours = location.hours ? resolveValue(location.hours, locale) : null;
              const mapLink = getMapsLink(location.slug, locale, location.geo, location.mapEmbedUrl);
              const rating = location.ratingSummary;
              const ratingScore = typeof rating?.score === 'number' ? rating.score : undefined;
              const ratingCount = typeof rating?.count === 'number' ? rating.count : undefined;
              return (
                <article
                  key={location.slug}
                  className="group wave-card relative flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-[0_20px_60px_rgba(7,17,52,0.08)]"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                        {lang === 'ms' ? 'Cawangan SeaMoneeCredit' : 'SeaMoneeCredit Branch'}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">
                        {resolveValue(location.name, locale)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
                      {rating && (
                        <div className="mt-3 flex items-center gap-1 text-amber-500 text-xs font-semibold">
                          <Star className="h-4 w-4 fill-current" />
                          <span>
                            {typeof ratingScore === 'number'
                              ? `${ratingScore.toFixed(1)} / 5`
                              : lang === 'ms'
                              ? 'Tiada penilaian'
                              : 'No rating'}
                            {typeof ratingCount === 'number' && (
                              <span className="ml-1 text-muted-foreground">
                                ({ratingCount}+)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="rounded-full border border-primary/20 px-3 py-1 text-xs text-primary">
                      {lang === 'ms' ? 'Walk-in' : 'Walk-in'}
                    </span>
                  </div>
                  <dl className="mt-6 space-y-4 text-sm">
                    <div className="flex gap-3">
                      <MapPin className="mt-1 h-4 w-4 text-primary" />
                      <div>
                        <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          {lang === 'ms' ? 'Alamat' : 'Address'}
                        </dt>
                        <dd className="mt-1 text-foreground">{address}</dd>
                        <a
                          href={mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          {lang === 'ms' ? 'Dapatkan arah' : 'Get directions'}
                        </a>
                      </div>
                    </div>
                    {location.phone && (
                      <div className="flex gap-3">
                        <Phone className="mt-1 h-4 w-4 text-primary" />
                        <div>
                          <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            {lang === 'ms' ? 'Telefon' : 'Phone'}
                          </dt>
                          <dd className="mt-1 font-semibold text-foreground">
                            <a href={`tel:${location.phone}`} className="hover:text-primary">
                              {location.phone}
                            </a>
                          </dd>
                        </div>
                      </div>
                    )}
                    {location.whatsapp && (
                      <div className="flex gap-3">
                        <Phone className="mt-1 h-4 w-4 text-green-600" />
                        <div>
                          <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            WhatsApp
                          </dt>
                          <dd className="mt-1 font-semibold text-foreground">
                            <a
                              href={`https://wa.me/${location.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary"
                            >
                              {location.whatsapp}
                            </a>
                          </dd>
                        </div>
                      </div>
                    )}
                    {hours && (
                      <div className="flex gap-3">
                        <Clock className="mt-1 h-4 w-4 text-primary" />
                        <div>
                          <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            {lang === 'ms' ? 'Waktu operasi' : 'Business hours'}
                          </dt>
                          <dd className="mt-1 text-foreground">{hours}</dd>
                        </div>
                      </div>
                    )}
                  </dl>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="flex-1">
                      <Link href={`/${locale}/locations/${location.slug}`}>
                        {lang === 'ms' ? 'Lihat butiran' : 'View branch details'}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/${locale}/apply`} className="inline-flex items-center gap-2">
                        {lang === 'ms' ? 'Mohon' : 'Apply'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[32px] border border-border bg-gradient-to-br from-primary/5 to-secondary/20 p-8 text-center shadow-[0_30px_90px_rgba(6,16,46,0.12)]">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
            {lang === 'ms' ? 'Sediakan lawatan anda' : 'Plan your visit'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">
            {lang === 'ms'
              ? 'Temujanji bersemuka & konsultasi maya tersedia'
              : 'In-person and virtual consultations available'}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === 'ms'
              ? 'Setiap cawangan boleh membantu anda menerbitkan surat tawaran pinjaman, semak dokumen CTOS/CCRIS, dan berhubung dengan bank rakan kongsi.'
              : 'Each branch can issue loan offer letters, review CTOS/CCRIS documents, and liaise with partner banks on your behalf.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/${locale}/apply`}>
                {lang === 'ms' ? 'Mohon dalam talian' : 'Apply online'}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/${locale}/contact`}>
                {lang === 'ms' ? 'Bincang dengan kami' : 'Speak with us'}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
