'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

type Product = {
  _id: string;
  slug: string;
  name: { en?: string; ms?: string };
  description?: { en?: string; ms?: string };
  interestRate?: { min?: number; max?: number };
  loanAmount?: { min?: number; max?: number };
  tenure?: { min?: number; max?: number };
  features?: Array<{ en?: string; ms?: string }>;
  isFeatured?: boolean;
};

export default function ProductsSection() {
  const t = useTranslations('products');
  const locale = useLocale();
  const lang = locale === 'ms' ? 'ms' : 'en';
  const [products, setProducts] = useState<Product[]>([]);
  const [ratingMap, setRatingMap] = useState<Record<string, { score: number; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const featuredBadge = t('featuredBadge');
  const flexibleBadge = t('flexibleBadge');
  const customAmountLabel = t('customAmount');
  const tenureUnit = t('tenureUnit');
  const compareLimit = 2;
  const canCompare = compareIds.length > 1;
  const compareItems = useMemo(
    () => products.filter((product) => compareIds.includes(product._id)).slice(0, compareLimit),
    [compareIds, products]
  );

  const formatAmount = (product: Product) => {
    if (product.loanAmount?.min && product.loanAmount?.max) {
      return `RM ${product.loanAmount.min.toLocaleString()} – RM ${product.loanAmount.max.toLocaleString()}`;
    }
    if (product.loanAmount?.max) {
      return `${t('loanUpTo')} RM ${product.loanAmount.max.toLocaleString()}`;
    }
    return customAmountLabel;
  };

  const fetchAggregates = async (slugs: string[]) => {
    try {
      const params = new URLSearchParams({ loanTypes: slugs.join(',') });
      const res = await fetch(`/api/testimonials/aggregates?${params.toString()}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data) {
        setRatingMap(json.data);
      }
    } catch (error) {
      console.warn('Failed to fetch rating aggregates', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then((response) => {
        if (!isMounted) return;
        if (response.success && response.data) {
          const list = response.data as Product[];
          setProducts(list);
          if (list.length) {
            fetchAggregates(list.map((product) => product.slug));
          }
        } else {
          setError(response.message || 'Failed to load products');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
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
  }, []);

  const handleLearnClick = (slug: string) => trackEvent(`product_learn_click_home_${slug}`);
  const handleApplyClick = (slug: string) => trackEvent(`product_apply_click_home_${slug}`);
  const toggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= compareLimit) {
        return prev;
      }
      return [...prev, productId];
    });
  };

  const formatInterest = (product: Product) => {
    const { interestRate } = product;
    if (!interestRate) return '—';
    if (interestRate.min && interestRate.max && interestRate.min !== interestRate.max) {
      return `${interestRate.min}% – ${interestRate.max}%`;
    }
    if (interestRate.min) return `${interestRate.min}%`;
    return '—';
  };

  const formatTenure = (product: Product) => {
    if (!product.tenure) return '—';
    if (product.tenure.min && product.tenure.max && product.tenure.min !== product.tenure.max) {
      return `${product.tenure.min}-${product.tenure.max} ${tenureUnit}`;
    }
    if (product.tenure.max) return `${product.tenure.max} ${tenureUnit}`;
    return `${product.tenure.min} ${tenureUnit}`;
  };

  const renderProducts = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-2xl border bg-white/80 p-6 shadow-sm animate-pulse">
              <div className="h-6 w-1/2 rounded bg-muted" />
              <div className="mt-4 h-4 w-full rounded bg-muted" />
              <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
                <div className="h-4 w-3/5 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-sm text-muted-foreground">{error}</p>;
    }

    if (products.length === 0) {
      return (
        <p className="text-center text-sm text-muted-foreground">{t('emptyState')}</p>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product._id}
            className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_25px_70px_rgba(6,18,45,0.1)] transition hover:-translate-y-1 ${
              product.isFeatured ? 'ring-2 ring-primary/30' : ''
            }`}
          >
            <div
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-200 via-primary to-indigo-500 opacity-70"
              aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/70">
                {product.isFeatured ? featuredBadge : flexibleBadge}
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="digital-display--dark">{formatInterest(product)}</span>
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-foreground">
              {product.name?.[lang] || product.name?.en}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {product.description?.[lang] || product.description?.en}
            </p>

            <div className="mt-6 grid gap-3 rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('loanUpTo')}</span>
                <span className="digital-display--dark text-lg font-semibold text-foreground">
                  {formatAmount(product)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('tenureUpTo')}</span>
                <span className="digital-display--dark text-lg font-semibold text-foreground">
                  {formatTenure(product)}
                </span>
              </div>
            </div>

            {(product.features || []).length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {(product.features || [])
                  .slice(0, 3)
                  .map((feature, idx) => (
                    <li key={`${product._id}-${idx}`} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
                      <span>{feature?.[lang] || feature?.en}</span>
                    </li>
                  ))}
              </ul>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/${locale}/products/${product.slug}`} onClick={() => handleLearnClick(product.slug)}>
                  {t('learnMore')}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary"
              >
                <Link href={`/${locale}/apply`} onClick={() => handleApplyClick(product.slug)}>
                  {t('apply')}
                </Link>
              </Button>
            </div>
            <Button
              type="button"
              variant={compareIds.includes(product._id) ? 'default' : 'outline'}
              className="mt-3 w-full border-primary/40 bg-white text-primary hover:bg-primary/5 hover:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={compareIds.includes(product._id)}
              onClick={() => toggleCompare(product._id)}
            >
              {compareIds.includes(product._id) ? t('compare.selected') : t('compare.add')}
            </Button>
            {ratingMap[product.slug]?.score ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{ratingMap[product.slug].score.toFixed(1)} / 5</span>
                <span className="text-amber-600">
                  ({ratingMap[product.slug].count}+ {lang === 'ms' ? 'ulasan' : 'reviews'})
                </span>
              </div>
            ) : null}
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-16 md:py-20">
      <div className="hero-circuit opacity-15" aria-hidden="true" />
      <div className="container space-y-10">
        <div className="wave-grid rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_70px_rgba(8,18,51,0.08)] md:p-10">
          <div className="flex flex-col gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">{t('title')}</p>
              <h2 className="text-3xl font-bold text-foreground">
                Pick the right product for your next milestone
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Personal, business, and speciality loans with transparent pricing and a dedicated specialist guiding every step.
              </p>
            </div>
            <Button asChild variant="outline" className="self-center border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary md:self-auto">
              <Link href={`/${locale}/products`}>View all products</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[0_20px_60px_rgba(8,18,51,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                {t('compare.title')}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('compare.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                {t('compare.counter', { count: compareIds.length, max: compareLimit })}
              </span>
              <Button
                type="button"
                variant="outline"
                className="border-primary/40 bg-white text-primary hover:bg-primary/5 hover:border-primary"
                onClick={() => setCompareIds([])}
                disabled={compareIds.length === 0}
              >
                {t('compare.clear')}
              </Button>
            </div>
          </div>

          {canCompare ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {compareItems.map((product) => (
                <div
                  key={`compare-${product._id}`}
                  className="rounded-3xl border border-primary/15 bg-primary/5 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                        {product.isFeatured ? featuredBadge : flexibleBadge}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-foreground">
                        {product.name?.[lang] || product.name?.en || t('compare.unknown')}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => toggleCompare(product._id)}
                    >
                      {t('compare.remove')}
                    </Button>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                      <span className="text-muted-foreground">{t('compare.amount')}</span>
                      <span className="font-semibold text-foreground">{formatAmount(product)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                      <span className="text-muted-foreground">{t('compare.rate')}</span>
                      <span className="font-semibold text-foreground">{formatInterest(product)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                      <span className="text-muted-foreground">{t('compare.tenure')}</span>
                      <span className="font-semibold text-foreground">{formatTenure(product)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/${locale}/products/${product.slug}`} onClick={() => handleLearnClick(product.slug)}>
                        {t('compare.view')}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-white">
                      <Link href={`/${locale}/apply`} onClick={() => handleApplyClick(product.slug)}>
                        {t('compare.apply')}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-5 py-6 text-sm text-muted-foreground">
              {t('compare.empty')}
            </div>
          )}
        </div>
        {renderProducts()}
      </div>
    </section>
  );
}
