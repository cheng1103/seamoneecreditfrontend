'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface Product {
  name?: { en?: string; ms?: string };
  slug: string;
  description?: { en?: string; ms?: string };
  features?: { en?: string; ms?: string }[];
  loanAmount?: { min?: number; max?: number };
  interestRate?: { min?: number; max?: number; type?: string };
  tenure?: { min?: number; max?: number };
  requirements?: { en?: string; ms?: string }[];
  documents?: { en?: string; ms?: string }[];
  ctosFee?: number;
  ratingSummary?: {
    score?: number;
    count?: number;
  };
}

interface Testimonial {
  _id: string;
  name: string;
  rating?: number;
  content?: { en?: string; ms?: string };
  createdAt?: string;
}

interface Props {
  product: Product;
  locale: string;
  testimonials?: Testimonial[];
}

export default function ProductDetailClient({ product, locale, testimonials = [] }: Props) {
  const lang = locale === 'ms' ? 'ms' : 'en';
  const ratingSummary = product.ratingSummary;
  const highlightedTestimonials = testimonials.slice(0, 3);
  const productName =
    product.name?.[lang] || product.name?.en || product.name?.ms || product.slug;
  const productDescription =
    product.description?.[lang] || product.description?.en || product.description?.ms || '';
  const features = product.features ?? [];
  const requirements = product.requirements ?? [];
  const documents = product.documents ?? [];
  const loanAmountText =
    typeof product.loanAmount?.min === 'number' && typeof product.loanAmount?.max === 'number'
      ? `RM ${product.loanAmount.min.toLocaleString()} - RM ${product.loanAmount.max.toLocaleString()}`
      : lang === 'ms'
      ? 'Hubungi kami untuk julat pinjaman'
      : 'Contact us for loan range';
  const interestRateText =
    typeof product.interestRate?.min === 'number' && typeof product.interestRate?.max === 'number'
      ? `${product.interestRate.min}% - ${product.interestRate.max}% p.a.`
      : lang === 'ms'
      ? 'Kadar tertakluk kepada kelulusan'
      : 'Rates subject to approval';
  const tenureText =
    typeof product.tenure?.min === 'number' && typeof product.tenure?.max === 'number'
      ? `${product.tenure.min} - ${product.tenure.max} ${lang === 'ms' ? 'bulan' : 'months'}`
      : lang === 'ms'
      ? 'Tempoh mengikut kelayakan'
      : 'Tenure based on eligibility';
  const ctosFeeText =
    typeof product.ctosFee === 'number'
      ? `RM ${product.ctosFee} ${lang === 'ms' ? 'untuk semakan kredit' : 'for credit check'}`
      : lang === 'ms'
      ? 'Yuran bergantung pada semakan'
      : 'Fee depends on verification';

  const handleApplyClick = () => {
    trackEvent(`apply_click_product_${product.slug}`);
  };

  const handleCalculatorClick = () => {
    trackEvent(`calculator_click_product_${product.slug}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-surface py-16 md:py-20 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200 mb-2">
              {lang === 'ms' ? 'Produk Pinjaman' : 'Loan Product'}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">{productName}</h1>
            <p className="text-lg text-white/85 mb-6">
              {productDescription}
            </p>
            {ratingSummary && ratingSummary.score ? (
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-amber-200/30 bg-white/10 px-4 py-2 text-amber-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`hero-rating-${index}`}
                      className={`h-4 w-4 ${index < Math.round(ratingSummary.score ?? 0) ? 'fill-current' : 'opacity-30'}`}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold">
                  {ratingSummary.score.toFixed(1)} / 5
                  <span className="ml-2 text-xs text-amber-200/80">
                    ({ratingSummary.count}+{' '}
                    {lang === 'ms' ? 'ulasan pelanggan' : 'borrower reviews'})
                  </span>
                </p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href={`/${locale}/apply`} onClick={handleApplyClick}>
                  {lang === 'ms' ? 'Mohon Sekarang' : 'Apply Now'}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary"
              >
                <Link href={`/${locale}/calculator`} onClick={handleCalculatorClick}>
                  {lang === 'ms' ? 'Kira Pinjaman' : 'Calculate Loan'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container -mt-10 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Highlights */}
            <div className="wave-card border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                {lang === 'ms' ? 'Ciri-ciri Utama' : 'Key Features'}
              </h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{feature?.[lang] || feature?.en || feature?.ms || ''}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="wave-card border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                {lang === 'ms' ? 'Syarat Kelayakan' : 'Eligibility Requirements'}
              </h2>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{req?.[lang] || req?.en || req?.ms || ''}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div className="wave-card border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                {lang === 'ms' ? 'Dokumen Diperlukan' : 'Required Documents'}
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {doc?.[lang] || doc?.en || doc?.ms || ''}
                  </li>
                ))}
              </ul>
            </div>

            {highlightedTestimonials.length > 0 && (
              <div className="wave-card border rounded-3xl p-6">
                <div className="mb-4 flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                    {lang === 'ms' ? 'Suara pelanggan' : 'Customer voices'}
                  </p>
                  <h2 className="text-xl font-semibold">
                    {lang === 'ms'
                      ? 'Apa kata peminjam tentang produk ini'
                      : 'What borrowers say about this product'}
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {highlightedTestimonials.map((testimonial) => (
                    <article
                      key={testimonial._id}
                      className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                          {testimonial.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {testimonial.name}
                          </p>
                          {testimonial.rating ? (
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={`${testimonial._id}-${index}`}
                                  className={`h-3.5 w-3.5 ${
                                    index < Math.round(testimonial.rating ?? 0)
                                      ? 'fill-current'
                                      : 'opacity-30'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground">
                                {testimonial.rating.toFixed(1)}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 text-sm">
                        “
                        {testimonial.content?.[lang] ||
                          testimonial.content?.en ||
                          testimonial.content?.ms ||
                          ''}
                        ”
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Loan Summary Card */}
            <div className="wave-card border rounded-3xl overflow-hidden sticky top-24">
              <div className="bg-primary text-primary-foreground p-4 text-center">
                <h3 className="font-semibold">
                  {lang === 'ms' ? 'Ringkasan Pinjaman' : 'Loan Summary'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-3 bg-muted/50 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    {lang === 'ms' ? 'Jumlah Pinjaman' : 'Loan Amount'}
                  </p>
                  <p className="font-semibold">{loanAmountText}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    {lang === 'ms' ? 'Kadar Faedah' : 'Interest Rate'}
                  </p>
                  <p className="font-semibold">{interestRateText}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    {lang === 'ms' ? 'Tempoh Pinjaman' : 'Loan Tenure'}
                  </p>
                  <p className="font-semibold">{tenureText}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-2xl border-t">
                  <p className="text-sm font-medium">
                    {lang === 'ms' ? 'Yuran CTOS' : 'CTOS Fee'}
                  </p>
                  <p className="text-sm text-muted-foreground">{ctosFeeText}</p>
                </div>

                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  <Link href={`/${locale}/apply`} onClick={handleApplyClick}>
                    {lang === 'ms' ? 'Mohon Sekarang' : 'Apply Now'}
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {lang === 'ms'
                    ? 'Kelulusan dalam 24 jam*'
                    : 'Approval within 24 hours*'}
                </p>
              </div>
              {ratingSummary && ratingSummary.score ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-amber-700">
                  <p className="text-xs uppercase tracking-[0.3em]">
                    {lang === 'ms' ? 'Penilaian pelanggan' : 'Borrower rating'}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={`sidebar-rating-${index}`}
                        className={`h-4 w-4 ${index < Math.round(ratingSummary.score ?? 0) ? 'fill-current' : 'opacity-30'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-amber-600">
                    {ratingSummary.score.toFixed(1)}
                  </p>
                  <p className="text-xs text-amber-700">
                    {ratingSummary.count}+ {lang === 'ms' ? 'ulasan' : 'reviews'}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
