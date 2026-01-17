'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Quote, Star } from 'lucide-react';
import { getFeaturedTestimonials } from '@/lib/api';
import { TestimonialsSchema } from '@/components/seo/StructuredData';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { defaultLocations } from '@/data/locations';

type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  rating?: number;
  content: {
    en?: string;
    ms?: string;
  };
  loanType?: string;
  branchSlug?: string;
};

type Props = {
  initialTestimonials?: Testimonial[];
};

export default function TestimonialsSection({ initialTestimonials }: Props) {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const { settings } = useSiteSettings();
  const [fetchedTestimonials, setFetchedTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(!initialTestimonials?.length);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [layout, setLayout] = useState({ perView: 1, pageCount: 1, itemWidth: 0, gap: 0 });
  const hasInitialTestimonials = Boolean(initialTestimonials?.length);
  const testimonials = hasInitialTestimonials ? (initialTestimonials as Testimonial[]) : fetchedTestimonials;
  const resolvedLoading = hasInitialTestimonials ? false : isLoading;

  useEffect(() => {
    if (hasInitialTestimonials) {
      return;
    }
    let isMounted = true;
    getFeaturedTestimonials()
      .then((response) => {
        if (!isMounted) return;
        if (response.success && response.data) {
          setFetchedTestimonials(response.data as Testimonial[]);
        } else {
          setError(response.message || 'Unable to load testimonials');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load testimonials');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasInitialTestimonials]);

  const lang = locale === 'ms' ? 'ms' : 'en';
  const stats = ['rating', 'speed', 'volume'].map((key) => ({
    label: t(`stats.${key}.label`),
    value: t(`stats.${key}.value`),
  }));
  const fallbackLoanType = t('loanTypeFallback');
  const locationEntries = settings.locations?.length ? settings.locations : defaultLocations;
  const totalItems = testimonials.length;
  const pageIndex = Math.min(
    Math.max(Math.floor(activeIndex / Math.max(layout.perView, 1)), 0),
    Math.max(layout.pageCount - 1, 0)
  );

  const updateLayout = () => {
    const container = sliderRef.current;
    if (!container) return;
    const item = container.querySelector<HTMLElement>('[data-slide]');
    if (!item) return;
    const style = window.getComputedStyle(container);
    const gap = Number.parseFloat(style.columnGap || style.gap || '0') || 0;
    const itemWidth = item.offsetWidth || 1;
    const perView = Math.max(1, Math.floor((container.clientWidth + gap) / (itemWidth + gap)));
    const pageCount = Math.max(1, Math.ceil(totalItems / perView));
    setLayout({ perView, pageCount, itemWidth, gap });
  };

  useEffect(() => {
    if (!totalItems) return;
    updateLayout();
    const handleResize = () => updateLayout();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [totalItems]);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;
    const handleScroll = () => {
      const step = layout.itemWidth + layout.gap;
      const index = step ? Math.round(container.scrollLeft / step) : 0;
      setActiveIndex(Math.max(0, Math.min(index, Math.max(totalItems - 1, 0))));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [layout.gap, layout.itemWidth, totalItems]);

  const scrollByPage = (direction: 1 | -1) => {
    const container = sliderRef.current;
    if (!container) return;
    container.scrollBy({ left: container.clientWidth * direction, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {testimonials.length > 0 && (
        <TestimonialsSchema
          testimonials={testimonials}
          locale={locale}
          locations={locationEntries}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030e2b] via-[#04183c] to-[#071f4a]" />
      <div className="hero-circuit opacity-50" aria-hidden="true" />
      <div className="absolute inset-x-0 top-10 flex justify-around opacity-20 blur-3xl" aria-hidden="true">
        <div className="h-40 w-40 rounded-full bg-sky-400/60" />
        <div className="h-24 w-24 rounded-full bg-white/30" />
      </div>
      <div className="container relative z-10 text-white">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-100/80">
            <Sparkles className="h-4 w-4 text-cyan-200" />
            <span>{t('pill')}</span>
          </div>
          <h2 className="text-3xl font-semibold md:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-base text-slate-200">{t('description')}</p>
        </div>

        {resolvedLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/15 bg-white/5 p-6 text-white/80 shadow-2xl shadow-black/10 backdrop-blur animate-pulse"
              >
                <div className="h-3 w-4/5 rounded bg-white/20" />
                <div className="mt-4 space-y-2">
                  <div className="h-2.5 w-full rounded bg-white/10" />
                  <div className="h-2.5 w-3/4 rounded bg-white/10" />
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-1/2 rounded bg-white/10" />
                    <div className="h-2 w-1/3 rounded bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm text-slate-300">
            {t('errors.load')}
          </p>
        ) : (
          <>
            <div className="mb-10 grid gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center backdrop-blur"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
                  <p className="digital-display relative text-2xl font-semibold">{stat.value}</p>
                  <p className="relative text-xs uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-white/70">
              <p className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]">
                {t('dragHint')}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  className="h-10 w-10 rounded-full border border-white/30 text-white transition hover:bg-white/10"
                  aria-label={t('controls.prev')}
                >
                  ‹
                </button>
                <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                  {t('controls.progress', { current: pageIndex + 1, total: layout.pageCount })}
                </span>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  className="h-10 w-10 rounded-full border border-white/30 text-white transition hover:bg-white/10"
                  aria-label={t('controls.next')}
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-2 pr-2 scroll-smooth snap-x snap-mandatory"
            >
              {testimonials.map((testimonial) => {
                const ratingRounded = Math.round(Math.max(0, Math.min(5, testimonial.rating ?? 0)));
                return (
                  <article
                    key={testimonial._id}
                    data-slide
                    className="group relative flex h-full min-w-[280px] flex-col rounded-3xl border border-white/15 bg-white/5 p-6 text-white shadow-[0_30px_60px_rgba(2,15,40,0.45)] backdrop-blur transition hover:-translate-y-1 snap-start sm:min-w-[320px] lg:min-w-[360px]"
                  >
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
                    <Quote className="h-8 w-8 text-white/30" />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-100/90">
                      “{testimonial.content?.[lang] || testimonial.content?.en}”
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-base font-semibold text-white">
                        {testimonial.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-slate-300">
                          {testimonial.location ? `${testimonial.location} • ` : ''}
                          {testimonial.loanType || fallbackLoanType}
                        </p>
                      </div>
                    </div>
                    {typeof testimonial.rating === 'number' && (
                      <div className="mt-4 flex items-center gap-1 text-amber-300">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${idx < ratingRounded ? '' : 'opacity-30'}`}
                            fill={idx < ratingRounded ? 'currentColor' : 'none'}
                          />
                        ))}
                        <span className="ml-2 text-xs text-white/60">{testimonial.rating?.toFixed(1)}</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: layout.pageCount }).map((_, idx) => (
                <span
                  key={`dot-${idx}`}
                  className={`h-2 w-2 rounded-full transition ${
                    idx === pageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
