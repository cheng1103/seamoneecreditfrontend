'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTestimonials } from '@/lib/api';
import { defaultLocations } from '@/data/locations';
import { BreadcrumbSchema, TestimonialsSchema, TestimonialsAggregateSchema } from '@/components/seo/StructuredData';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { baseUrl } from '@/lib/site';

type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  rating?: number;
  loanType?: string;
  branchSlug?: string;
  content: {
    en?: string;
    ms?: string;
  };
  createdAt?: string;
};

export default function TestimonialsPage() {
  const locale = useLocale();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { settings } = useSiteSettings();
  const locationOptions = settings.locations?.length ? settings.locations : defaultLocations;
  const branchSlugSet = useMemo(
    () => new Set(locationOptions.map((loc) => loc.slug)),
    [locationOptions]
  );

  const lang = (params?.locale as string) === 'ms' ? 'ms' : 'en';
  const t = useTranslations('testimonialsPage');

  const branchParam = searchParams?.get('branch');
  const branchParamValue = branchParam && branchSlugSet.has(branchParam) ? branchParam : 'all';
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loanFilter, setLoanFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const branchFilter = branchParamValue;
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    let mounted = true;
    getTestimonials(50, branchFilter === 'all' ? undefined : branchFilter)
      .then((response) => {
        if (!mounted) return;
        if (response.success && response.data) {
          setTestimonials(response.data as Testimonial[]);
          setError(null);
        } else {
          setError(response.message || 'Failed to load testimonials');
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load testimonials');
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [branchFilter]);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      const ratingPass = ratingFilter === 0 || (item.rating ?? 0) >= ratingFilter;
      const loanPass = loanFilter === 'all' || item.loanType === loanFilter;
      const branchPass = branchFilter === 'all' || item.branchSlug === branchFilter;
      return ratingPass && loanPass && branchPass;
    });
  }, [loanFilter, ratingFilter, branchFilter, testimonials]);

  const handleLoanFilterChange = (value: string) => {
    setLoanFilter(value);
    setVisibleCount(9);
  };

  const handleRatingFilterChange = (value: number) => {
    setRatingFilter(value);
    setVisibleCount(9);
  };

  const handleBranchFilterChange = (value: string) => {
    setIsLoading(true);
    setVisibleCount(9);
    const nextParams = new URLSearchParams(searchParams?.toString() || '');
    if (value === 'all') {
      nextParams.delete('branch');
    } else {
      nextParams.set('branch', value);
    }
    const queryString = nextParams.toString();
    router.replace(`/${locale}/testimonials${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  const displayedTestimonials = filteredTestimonials.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTestimonials.length;

  const uniqueLoanTypes = useMemo(() => {
    const types = new Set<string>();
    testimonials.forEach((item) => {
      if (item.loanType) types.add(item.loanType);
    });
    return Array.from(types);
  }, [testimonials]);

  const yearsActive = new Date().getFullYear() - 2014;
  const averageRating = useMemo(() => {
    if (!filteredTestimonials.length) return null;
    const total = filteredTestimonials.reduce((sum, item) => sum + (item.rating ?? 0), 0);
    const avg = total / filteredTestimonials.length;
    return Number.isFinite(avg) ? avg : null;
  }, [filteredTestimonials]);
  const branchesRepresented = useMemo(() => {
    const set = new Set<string>();
    testimonials.forEach((item) => {
      if (item.branchSlug) set.add(item.branchSlug);
    });
    return set.size;
  }, [testimonials]);
  const breadcrumbItems = [
    { name: lang === 'ms' ? 'Utama' : 'Home', url: `${baseUrl}/${locale}` },
    { name: t('title'), url: `${baseUrl}/${locale}/testimonials` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbItems} />
      {filteredTestimonials.length > 0 && (
        <TestimonialsSchema
          testimonials={filteredTestimonials}
          locale={locale}
          locations={locationOptions}
        />
      )}
      {averageRating && filteredTestimonials.length > 0 && (
        <TestimonialsAggregateSchema
          locale={locale}
          ratingValue={averageRating}
          reviewCount={filteredTestimonials.length}
          locations={locationOptions}
          branchSlug={branchFilter === 'all' ? null : branchFilter}
        />
      )}
      <section className="relative overflow-hidden hero-surface py-16 md:py-20 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container text-center space-y-4 relative">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200">
            {t('title')}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold">{t('subtitle')}</h1>
        </div>
      </section>

      <div className="container -mt-10 py-12 space-y-10">
        <div className="grid gap-4 rounded-3xl border border-border bg-white p-6 shadow-sm md:grid-cols-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('filterLabel')}</label>
            <select
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={loanFilter}
              onChange={(e) => handleLoanFilterChange(e.target.value)}
            >
              <option value="all">{t('filters.all')}</option>
              {uniqueLoanTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`filters.${type}` as const, { default: type })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('ratingLabel')}</label>
            <select
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={ratingFilter}
              onChange={(e) => handleRatingFilterChange(Number(e.target.value))}
            >
              <option value={0}>{t('filters.all')}</option>
              {[5, 4, 3].map((value) => (
                <option key={value} value={value}>
                  {value}+ ★
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('branchLabel')}</label>
            <select
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={branchFilter}
              onChange={(e) => handleBranchFilterChange(e.target.value)}
            >
              <option value="all">{t('branches.all')}</option>
              {locationOptions.map((location) => (
                <option key={location.slug} value={location.slug}>
                  {locale === 'ms' ? location.name.ms : location.name.en}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('meta.yearsActive')}</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{yearsActive}+ </p>
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('meta.customersHelped')}</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{testimonials.length.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {lang === 'ms' ? 'Cawangan dalam testimoni' : 'Branches represented'}
            </p>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {branchesRepresented || locationOptions.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === 'ms' ? 'Liputan bandar yang dikongsi' : 'Cities highlighted in reviews'}
            </p>
          </div>
          {averageRating && (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
                {lang === 'ms' ? 'Purata skor pelanggan' : 'Average rating'}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1 text-amber-500">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={`avg-${idx}`}
                    className={`h-4 w-4 ${idx < Math.round(averageRating) ? 'fill-current' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-2xl font-semibold text-amber-600">
                {averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === 'ms' ? 'Berdasarkan testimoni terpilih' : 'Based on featured reviews'}
              </p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">{t('loading')}</div>
        ) : error ? (
          <p className="text-center text-sm text-red-500">{error}</p>
        ) : filteredTestimonials.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">{t('empty')}</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedTestimonials.map((testimonial) => (
                <article
                  key={testimonial._id}
                  className="group wave-card relative flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-[0_20px_60px_rgba(7,17,52,0.08)]"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
                  <Quote className="h-8 w-8 text-primary/40" />
                  <p className="mt-4 flex-1 text-sm text-muted-foreground">
                    “{testimonial.content?.[lang] || testimonial.content?.en}”
                  </p>
                  <div className="mt-6">
                    <p className="text-base font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[testimonial.location, testimonial.loanType ? t(`filters.${testimonial.loanType}` as const, { default: testimonial.loanType }) : null]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                    {typeof testimonial.rating === 'number' && (
                      <div className="mt-3 flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${idx < Math.round(testimonial.rating ?? 0) ? 'fill-current' : 'opacity-30'}`}
                          />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">{testimonial.rating?.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setVisibleCount((prev) => prev + 6)}>
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </>
        )}

        <div className="rounded-[36px] border border-border bg-gradient-to-br from-primary/5 to-secondary/30 p-8 text-center shadow-[0_30px_80px_rgba(9,15,45,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/70">{t('title')}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground">{t('ctaTitle')}</h2>
          <p className="mt-3 text-muted-foreground">{t('ctaSubtitle')}</p>
          <Button asChild size="lg" className="mt-6">
            <Link href={`/${locale}/apply`}>{t('applyNow')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
