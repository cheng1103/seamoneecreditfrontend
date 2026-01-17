import { Metadata } from 'next';
import { baseUrl } from '@/lib/site';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Quote, Star, MapPin, Phone, Clock, Navigation, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BreadcrumbSchema, FAQSchema, LocationSchema, TestimonialsSchema } from '@/components/seo/StructuredData';
import { getBranchTestimonialsServer } from '@/lib/server/testimonials';
import { getLocations } from '@/lib/server/locations';
import type { LocalizedValue, LocationEntry } from '@/types/site';

type Params = { locale: string; city: string };
type Props = { params: Params };

const SUPPORTED_LOCALES = ['en', 'ms'] as const;
const defaultMapEmbed =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0233374090897!2d101.69236347609481!3d3.152481153251457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc36260c358221%3A0x8bb2745078e1bc6e!2sKuala%20Lumpur%20City%20Centre!5e0!3m2!1sen!2smy!4v1710000000000!5m2!1sen!2smy';

const getLocation = (slug: string, entries: LocationEntry[]) =>
  entries.find((loc) => loc.slug === slug);

export async function generateStaticParams() {
  const locationEntries = await getLocations();
  return locationEntries.flatMap((loc) =>
    SUPPORTED_LOCALES.map((locale) => ({
      locale,
      city: loc.slug,
    }))
  );
}

const resolveLocalized = (value: LocalizedValue | undefined, locale: string, fallback?: string) => {
  const lang = locale === 'ms' ? 'ms' : 'en';
  return value?.[lang as 'en' | 'ms'] || fallback || value?.en || '';
};

const defaultServices: LocalizedValue[] = [
  {
    en: 'Licensed loan consultation with transparent pricing',
    ms: 'Konsultasi pinjaman berlesen dengan harga telus',
  },
  {
    en: 'Document verification and CTOS/CCRIS review',
    ms: 'Pengesahan dokumen serta semakan CTOS/CCRIS',
  },
  {
    en: 'WhatsApp follow-ups for application status',
    ms: 'Tindak lanjut status permohonan melalui WhatsApp',
  },
];

const defaultAreas: LocalizedValue[] = [
  { en: 'Nationwide remote borrowers', ms: 'Peminjam jarak jauh seluruh negara' },
  { en: 'Walk-in visitors by appointment', ms: 'Pengunjung walk-in melalui janji temu' },
];

const defaultFaqs: { question: LocalizedValue; answer: LocalizedValue }[] = [
  {
    question: {
      en: 'What documents should I prepare before visiting a branch?',
      ms: 'Dokumen apa perlu disediakan sebelum ke cawangan?',
    },
    answer: {
      en: 'Bring your NRIC/passport, latest three months payslips, bank statements, and any existing loan statements so we can underwrite your application on the spot.',
      ms: 'Bawa kad pengenalan/pasport, slip gaji 3 bulan terkini, penyata bank serta penyata pinjaman sedia ada untuk membolehkan kami menilai permohonan terus.',
    },
  },
  {
    question: {
      en: 'Can my co-applicant sign digitally if they are in another city?',
      ms: 'Bolehkah penjamin menandatangani secara digital jika berada di bandar lain?',
    },
    answer: {
      en: 'Yes, we facilitate e-signature and courier verification for co-applicants who cannot attend in person.',
      ms: 'Ya, kami menyediakan tandatangan elektronik dan pengesahan kurier untuk penjamin yang tidak dapat hadir secara fizikal.',
    },
  },
];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, city } = params;
  const locationEntries = await getLocations();
  const location = getLocation(city, locationEntries);
  if (!location) {
    return { title: 'Location Not Found | SeaMoneeCredit' };
  }
  const name = resolveLocalized(location.name, locale);
  const description = resolveLocalized(location.summary, locale);
  const url = `${baseUrl}/${locale}/locations/${city}`;
  const alternates = {
    canonical: url,
    languages: {
      en: `${baseUrl}/en/locations/${city}`,
      ms: `${baseUrl}/ms/locations/${city}`,
    },
  };
  return {
    title: `${name} | SeaMoneeCredit`,
    description,
    alternates,
    openGraph: {
      title: `${name} | SeaMoneeCredit`,
      description,
      url,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og/location-${city}.jpg`,
          alt: `${name} | SeaMoneeCredit`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | SeaMoneeCredit`,
      description,
    },
    other: {
      ...(location.geo?.lat && location.geo?.lng
        ? {
            'geo.position': `${location.geo.lat};${location.geo.lng}`,
            ICBM: `${location.geo.lat}, ${location.geo.lng}`,
          }
        : {}),
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { locale, city } = params;
  const locationEntries = await getLocations();
  const location = getLocation(city, locationEntries);

  if (!location) {
    notFound();
  }

  const lang = locale === 'ms' ? 'ms' : 'en';
  const title = resolveLocalized(location.name, locale);
  const summary = resolveLocalized(location.summary, locale);
  const address = resolveLocalized(location.address, locale);
  const hours = location.hours?.[lang as 'en' | 'ms'];
  const services = (location.services?.length ? location.services : defaultServices).map((item) =>
    resolveLocalized(item, locale)
  );
  const areas = (location.areasServed?.length ? location.areasServed : defaultAreas).map((item) =>
    resolveLocalized(item, locale)
  );
  const faqs = (location.faqs?.length ? location.faqs : defaultFaqs).map((faq) => ({
    question: resolveLocalized(faq.question, locale),
    answer: resolveLocalized(faq.answer, locale),
  }));
  const branchTestimonials = await getBranchTestimonialsServer(location.slug, 6);
  const hasBranchTestimonials = branchTestimonials.length > 0;
  const localizedBranchTestimonials = branchTestimonials.map((testimonial) => ({
    ...testimonial,
    contentText:
      testimonial.content?.[lang as 'en' | 'ms'] ||
      testimonial.content?.en ||
      testimonial.content?.ms ||
      '',
  }));
  const testimonialRatings = branchTestimonials.filter(
    (testimonial) => typeof testimonial.rating === 'number' && (testimonial.rating ?? 0) > 0
  );
  const fallbackRatingSummary =
    !location.ratingSummary && testimonialRatings.length
      ? {
          score:
            testimonialRatings.reduce(
              (sum, testimonial) => sum + (testimonial.rating ?? 0),
              0
            ) / testimonialRatings.length,
          count: testimonialRatings.length,
        }
      : undefined;
  const ratingSummary = location.ratingSummary || fallbackRatingSummary;
  const ratingScore =
    typeof ratingSummary?.score === 'number' ? ratingSummary.score : undefined;
  const ratingCount =
    typeof ratingSummary?.count === 'number' ? ratingSummary.count : undefined;
  const locationForSchema = ratingSummary ? { ...location, ratingSummary } : location;
  const breadcrumbItems = [
    { name: lang === 'ms' ? 'Utama' : 'Home', url: `${baseUrl}/${locale}` },
    { name: lang === 'ms' ? 'Lokasi' : 'Locations', url: `${baseUrl}/${locale}/locations` },
    { name: title, url: `${baseUrl}/${locale}/locations/${city}` },
  ];
  const mapEmbedUrl = location.mapEmbedUrl || defaultMapEmbed;
  const directionsUrl =
    location.geo?.lat && location.geo?.lng
      ? `https://www.google.com/maps/search/?api=1&query=${location.geo.lat},${location.geo.lng}`
      : mapEmbedUrl;
  const whatsappLink = location.whatsapp
    ? `https://wa.me/${location.whatsapp.replace(/[^0-9]/g, '')}`
    : undefined;
  const emailLink = location.email ? `mailto:${location.email}` : undefined;
  const shareUrl = `${baseUrl}/${locale}/locations/${city}`;
  const otherLocations = locationEntries.filter((entry) => entry.slug !== location.slug);

  return (
    <div className="min-h-screen bg-background">
      <LocationSchema location={locationForSchema} locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      {hasBranchTestimonials && (
        <TestimonialsSchema
          testimonials={branchTestimonials}
          locale={locale}
          locations={locationEntries}
        />
      )}
      <section className="hero-surface relative overflow-hidden py-16 text-white">
        <div className="hero-circuit" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">
            {lang === 'ms' ? 'Cawangan SeaMoneeCredit' : 'SeaMoneeCredit Branch'}
          </p>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mt-4 text-lg text-white/85">{summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/${locale}/apply`}>{lang === 'ms' ? 'Mohon Sekarang' : 'Apply Now'}</Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white/60 hover:bg-white/10">
              <Link href={`/${locale}/contact`}>{lang === 'ms' ? 'Hubungi Kami' : 'Contact Us'}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-12 space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <div className="wave-card relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
            <h2 className="text-xl font-semibold">
              {lang === 'ms' ? 'Maklumat Lokasi' : 'Location Details'}
            </h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {lang === 'ms' ? 'Alamat' : 'Address'}
                </dt>
                <dd className="mt-1 text-foreground flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{address}</span>
                </dd>
              </div>
              {location.phone && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {lang === 'ms' ? 'Telefon' : 'Phone'}
                  </dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${location.phone}`} className="font-semibold text-primary">
                      {location.phone}
                    </a>
                  </dd>
                </div>
              )}
              {location.whatsapp && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WhatsApp</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary"
                    >
                      {location.whatsapp}
                    </a>
                  </dd>
                </div>
              )}
              {location.email && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {lang === 'ms' ? 'E-mel' : 'Email'}
                  </dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={emailLink} className="font-semibold text-primary">
                      {location.email}
                    </a>
                  </dd>
                </div>
              )}
              {hours && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {lang === 'ms' ? 'Waktu Operasi' : 'Business Hours'}
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{hours}</span>
                  </dd>
                </div>
              )}
              {ratingSummary && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {lang === 'ms' ? 'Penilaian' : 'Branch rating'}
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-foreground">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="font-semibold">
                      {typeof ratingScore === 'number'
                        ? `${ratingScore.toFixed(1)}/5`
                        : lang === 'ms'
                        ? 'Tiada penilaian'
                        : 'No rating'}
                    </span>
                    {typeof ratingCount === 'number' && (
                      <span className="text-xs text-muted-foreground">
                        ({ratingCount}+ {lang === 'ms' ? 'ulasan' : 'reviews'})
                      </span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              {location.phone && (
                <Button asChild className="flex-1 min-w-[160px]">
                  <a href={`tel:${location.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {lang === 'ms' ? 'Hubungi Pejabat' : 'Call Branch'}
                  </a>
                </Button>
              )}
              {whatsappLink && (
                <Button asChild variant="outline" className="flex-1 min-w-[160px]">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}
              <Button asChild variant="ghost" className="flex-1 min-w-[160px]">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="mr-2 h-4 w-4" />
                  {lang === 'ms' ? 'Dapatkan Arah' : 'Get Directions'}
                </a>
              </Button>
            </div>
          </div>

          <div className="wave-card relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
            <h2 className="text-xl font-semibold">
              {lang === 'ms' ? 'Peta & Arah' : 'Map & Directions'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === 'ms'
                ? 'Gunakan peta interaktif di bawah untuk merancang lawatan anda.'
                : 'Use the map below to plan your visit.'}
            </p>
            <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl border">
              <iframe
                src={mapEmbedUrl}
                className="h-full w-full"
                loading="lazy"
                title={`${title} map`}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="secondary" className="w-full">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="mr-2 h-4 w-4" />
                  {lang === 'ms' ? 'Buka Google Maps' : 'Open Google Maps'}
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Share2 className="mr-2 h-4 w-4" />
                  {lang === 'ms' ? 'Kongsi lokasi' : 'Share location'}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <section className="grid gap-8 rounded-3xl border border-border bg-white p-6 shadow md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
              {lang === 'ms' ? 'Perkhidmatan tempatan' : 'Local services'}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">
              {lang === 'ms' ? 'Apa yang kami sediakan di cawangan ini' : 'What this branch offers'}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((service, index) => (
                <li
                  key={`${service}-${index}`}
                  className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-foreground"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
              {lang === 'ms' ? 'Kawasan liputan' : 'Areas we cover'}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">
              {lang === 'ms' ? 'Bandar & kejiranan dilayan' : 'Neighbourhoods served'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === 'ms'
                ? 'Temujanji fizikal dan maya tersedia untuk kawasan berikut. Hubungi kami untuk melihat slot lapang.'
                : 'We support in-person and virtual appointments for these areas. Chat with us to secure a slot.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {areas.map((area, index) => (
                <span
                  key={`${area}-${index}`}
                  className="rounded-full border border-primary/20 px-4 py-1 text-xs font-semibold text-primary"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {hasBranchTestimonials && (
          <section className="rounded-3xl border border-border bg-white p-6 shadow">
            <div className="mb-4 flex flex-col gap-2 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
                {lang === 'ms' ? 'Testimoni kawasan ini' : 'Local success stories'}
              </p>
              <h3 className="text-2xl font-semibold text-foreground">
                {lang === 'ms'
                  ? `Pengalaman pelanggan sekitar ${title}`
                  : `Borrower feedback near ${title}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'ms'
                  ? 'Inilah kisah sebenar peminjam yang berjumpa penasihat kami di cawangan ini.'
                  : 'Real borrowers who met our advisors at this branch share their experience.'}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {localizedBranchTestimonials.map((testimonial) => (
                <article
                  key={testimonial._id}
                  className="group relative flex h-full flex-col rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-secondary/20 p-5 text-sm text-foreground shadow-sm"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
                  <Quote className="h-6 w-6 text-primary/70" />
                  <p className="mt-3 flex-1 text-muted-foreground">
                    “{testimonial.contentText}”
                  </p>
                  <div className="mt-4">
                    <p className="text-base font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[testimonial.location, testimonial.loanType].filter(Boolean).join(' • ')}
                    </p>
                    {typeof testimonial.rating === 'number' && (
                      <div className="mt-3 flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${idx < Math.round(testimonial.rating ?? 0) ? '' : 'opacity-30'}`}
                            fill={idx < Math.round(testimonial.rating ?? 0) ? 'currentColor' : 'none'}
                          />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {testimonial.rating?.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="outline" className="px-6">
                <Link href={`/${locale}/testimonials?branch=${city}`}>
                  {lang === 'ms' ? 'Lihat lebih banyak testimoni' : 'View more testimonials'}
                </Link>
              </Button>
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="rounded-3xl border border-border bg-white p-6 shadow">
            <div className="mb-4 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
                {lang === 'ms' ? 'Soalan lokasi' : 'Branch FAQs'}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">
                {lang === 'ms'
                  ? 'Soalan popular mengenai cawangan ini'
                  : 'Popular questions about this branch'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === 'ms'
                  ? 'Klik pada soalan untuk melihat jawapan ringkas oleh pasukan cawangan.'
                  : 'Select a question to see branch-specific guidance from our local team.'}
              </p>
            </div>
            <Accordion type="single" collapsible className="divide-y">
              {faqs.map((faq, index) => (
                <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
                  <AccordionTrigger className="text-sm font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {otherLocations.length > 0 && (
          <section className="rounded-3xl border border-border bg-white p-6 shadow">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
                  {lang === 'ms' ? 'Cawangan lain' : 'More branches'}
                </p>
                <h3 className="text-xl font-semibold text-foreground">
                  {lang === 'ms'
                    ? 'Perlu lokasi lain?'
                    : 'Need a different branch?'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'ms'
                    ? 'Kami turut beroperasi di bandar-bandar berikut.'
                    : 'SeaMoneeCredit advisors are also available in these cities.'}
                </p>
              </div>
              <Button asChild variant="ghost" className="text-primary hover:bg-primary/5">
                <Link href={`/${locale}/locations`}>
                  {lang === 'ms' ? 'Lihat semua lokasi' : 'Browse all locations'}
                </Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherLocations.slice(0, 3).map((other) => (
                <article key={other.slug} className="rounded-2xl border border-border/80 bg-white/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {resolveLocalized(other.name, locale, other.slug)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resolveLocalized(other.address, locale)}
                      </p>
                    </div>
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  {other.ratingSummary && (
                    <p className="mt-2 text-xs font-semibold text-amber-500">
                      <Star className="mr-1 inline h-3.5 w-3.5 fill-current" />
                      {other.ratingSummary.score?.toFixed(1)} ({other.ratingSummary.count}+)
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {other.phone && (
                      <span className="rounded-full border border-primary/20 px-3 py-1 text-primary">
                        {other.phone}
                      </span>
                    )}
                    {other.areasServed?.[0] && (
                      <span className="rounded-full border border-primary/20 px-3 py-1 text-primary/80">
                        {resolveLocalized(other.areasServed[0], locale)}
                      </span>
                    )}
                  </div>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link href={`/${locale}/locations/${other.slug}`}>
                      {lang === 'ms' ? 'Lihat cawangan' : 'View branch'}
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
