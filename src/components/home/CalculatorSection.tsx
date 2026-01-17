'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProducts } from '@/lib/api';

type Product = {
  _id: string;
  slug: string;
  name: { en?: string; ms?: string };
  interestRate?: { min?: number; max?: number; type?: string };
  loanAmount?: { min?: number; max?: number };
  tenure?: { min?: number; max?: number };
};

type CalculatorLimits = {
  amountMin: number;
  amountMax: number;
  amountStep: number;
  tenureMin: number;
  tenureMax: number;
  tenureStep: number;
  fallbackRate: number;
};

const DEFAULT_LIMITS: CalculatorLimits = {
  amountMin: 5000,
  amountMax: 200000,
  amountStep: 1000,
  tenureMin: 12,
  tenureMax: 120,
  tenureStep: 6,
  fallbackRate: 4.88,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ALLOWED_INTEREST_TYPES = ['flat', 'reducing'] as const;
type InterestType = (typeof ALLOWED_INTEREST_TYPES)[number];

export default function CalculatorSection() {
  const t = useTranslations('calculator');
  const locale = useLocale();

  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [limits, setLimits] = useState<CalculatorLimits>(DEFAULT_LIMITS);

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then((response) => {
        if (!isMounted) return;
        if (response.success && response.data) {
          const apiProducts = response.data as Product[];
          setProducts(apiProducts);
          if (apiProducts.length > 0) {
            setSelectedProduct((prev) => prev || apiProducts[0].slug);
          }

          const aggregated = apiProducts.reduce(
            (acc, product) => {
              if (product.loanAmount?.min) {
                acc.amountMin = Math.min(acc.amountMin, product.loanAmount.min);
              }
              if (product.loanAmount?.max) {
                acc.amountMax = Math.max(acc.amountMax, product.loanAmount.max);
              }
              if (product.tenure?.min) {
                acc.tenureMin = Math.min(acc.tenureMin, product.tenure.min);
              }
              if (product.tenure?.max) {
                acc.tenureMax = Math.max(acc.tenureMax, product.tenure.max);
              }
              if (product.interestRate?.min) {
                acc.fallbackRate = Math.min(acc.fallbackRate, product.interestRate.min);
              }
              return acc;
            },
            {
              amountMin: Number.POSITIVE_INFINITY,
              amountMax: 0,
              tenureMin: Number.POSITIVE_INFINITY,
              tenureMax: 0,
              fallbackRate: Number.POSITIVE_INFINITY,
            }
          );

          const amountMin = Number.isFinite(aggregated.amountMin)
            ? Math.max(1000, Math.floor(aggregated.amountMin / 1000) * 1000)
            : DEFAULT_LIMITS.amountMin;
          const amountMax = Number.isFinite(aggregated.amountMax)
            ? Math.ceil(aggregated.amountMax / 1000) * 1000
            : DEFAULT_LIMITS.amountMax;
          const amountSpan = Math.max(amountMax - amountMin, 1000);
          const amountStep =
            Math.round(Math.max(amountSpan / 20, 1000) / 1000) * 1000 || DEFAULT_LIMITS.amountStep;

          const tenureMin = Number.isFinite(aggregated.tenureMin)
            ? Math.max(6, aggregated.tenureMin)
            : DEFAULT_LIMITS.tenureMin;
          const tenureMax = Number.isFinite(aggregated.tenureMax)
            ? aggregated.tenureMax
            : DEFAULT_LIMITS.tenureMax;

          setLimits({
            amountMin,
            amountMax,
            amountStep,
            tenureMin,
            tenureMax,
            tenureStep: DEFAULT_LIMITS.tenureStep,
            fallbackRate: Number.isFinite(aggregated.fallbackRate)
              ? Number(aggregated.fallbackRate.toFixed(2))
              : DEFAULT_LIMITS.fallbackRate,
          });

          setLoanAmount((prev) => clamp(prev, amountMin, amountMax));
          setLoanTerm((prev) => clamp(prev, tenureMin, tenureMax));
        }
      })
      .catch(() => {
        // Ignore silently, fallback to defaults
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProduct = useMemo(
    () => products.find((item) => item.slug === selectedProduct),
    [products, selectedProduct]
  );

  const effectiveRate = activeProduct?.interestRate?.min ?? limits.fallbackRate;

  const resolveInterestType = (value?: string): InterestType => {
    if (value && ALLOWED_INTEREST_TYPES.includes(value as InterestType)) {
      return value as InterestType;
    }
    return 'reducing';
  };

  const computePayments = (amount: number, term: number, annualRate: number, type: InterestType) => {
    if (!amount || !term) {
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
      };
    }

    if (type === 'flat') {
      const totalInterest = amount * (annualRate / 100) * (term / 12);
      const totalPayment = amount + totalInterest;
      return {
        monthlyPayment: totalPayment / term,
        totalPayment,
        totalInterest,
      };
    }

    const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;
    if (monthlyRate === 0) {
      return {
        monthlyPayment: amount / term,
        totalPayment: amount,
        totalInterest: 0,
      };
    }

    const factor = Math.pow(1 + monthlyRate, term);
    const monthlyPayment = (amount * monthlyRate * factor) / (factor - 1);
    const totalPayment = monthlyPayment * term;
    return {
      monthlyPayment,
      totalPayment,
      totalInterest: totalPayment - amount,
    };
  };

  const { monthlyPayment, totalPayment, totalInterest } = useMemo(() => {
    const rateType = resolveInterestType(activeProduct?.interestRate?.type);
    return computePayments(loanAmount, loanTerm, effectiveRate, rateType);
  }, [loanAmount, loanTerm, effectiveRate, activeProduct?.interestRate?.type]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const lang = locale === 'ms' ? 'ms' : 'en';

  return (
    <section className="relative py-16 md:py-20">
      <div className="hero-circuit opacity-15" aria-hidden="true" />
      <div className="container">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-white/70 bg-white/95 p-8 shadow-[0_30px_80px_rgba(8,18,51,0.12)] md:p-12">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              {t('title')}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">{t('heading')}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{t('description')}</p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4 rounded-3xl border border-white/70 bg-white px-5 py-6 shadow-[0_10px_35px_rgba(6,18,45,0.06)]">
                <Label>{t('selectProduct')}</Label>
                <Select
                  value={selectedProduct || undefined}
                  onValueChange={(value) => setSelectedProduct(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('chooseProduct')} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product.slug}>
                        {product.name?.[lang] || product.name?.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/70 bg-white px-5 py-6 shadow-[0_10px_35px_rgba(6,18,45,0.06)]">
                <div className="flex justify-between">
                  <Label>{t('loanAmount')}</Label>
                  <span className="font-semibold text-primary">{formatCurrency(loanAmount)}</span>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  min={limits.amountMin}
                  max={limits.amountMax}
                  step={limits.amountStep}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(limits.amountMin)}</span>
                  <span>{formatCurrency(limits.amountMax)}</span>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/70 bg-white px-5 py-6 shadow-[0_10px_35px_rgba(6,18,45,0.06)]">
                <div className="flex justify-between">
                  <Label>{t('loanTerm')}</Label>
                  <span className="font-semibold text-primary">
                    {loanTerm} {t('monthsLabel')}
                  </span>
                </div>
                <Slider
                  value={[loanTerm]}
                  onValueChange={(value) => setLoanTerm(value[0])}
                  min={limits.tenureMin}
                  max={limits.tenureMax}
                  step={limits.tenureStep}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {limits.tenureMin} {t('monthsLabel')}
                  </span>
                  <span>
                    {limits.tenureMax} {t('monthsLabel')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                <span className="text-muted-foreground">{t('interestRate')}</span>
                <span className="font-medium text-primary">{effectiveRate}% p.a.</span>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 text-white">
              {activeProduct && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/70">
                  <span>{activeProduct.name?.[lang] || activeProduct.name?.en}</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                    {effectiveRate}% p.a.
                  </span>
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-white/70">{t('monthlyPayment')}</p>
                <p className="digital-display mt-2 text-4xl font-semibold">
                  {formatCurrency(monthlyPayment)}
                </p>
                <p className="text-xs text-white/60">{t('perMonth')}</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center">
                  <p className="text-xs text-white/60">{t('totalPayment')}</p>
                  <p className="digital-display mt-1 text-lg font-semibold">{formatCurrency(totalPayment)}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center">
                  <p className="text-xs text-white/60">{t('totalInterest')}</p>
                  <p className="digital-display mt-1 text-lg font-semibold">{formatCurrency(totalInterest)}</p>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-white/70">
                {t('disclaimer', {
                  defaultMessage: 'Estimates only. Final rates depend on credit assessment.',
                })}
              </p>

              <Button asChild className="mt-4 w-full bg-white text-primary hover:bg-white/90 shadow-lg shadow-blue-900/30 font-semibold">
                <Link href={`/${locale}/apply`}>
                  {t('applyNow')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
