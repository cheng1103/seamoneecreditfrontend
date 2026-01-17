'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/api';

type Product = {
  _id: string;
  loanAmount?: { min?: number; max?: number };
  tenure?: { min?: number; max?: number };
  interestRate?: { min?: number; max?: number };
};

const DEFAULT_AMOUNTS = [5000, 10000, 20000, 30000, 50000, 70000, 100000];
const DEFAULT_TENURES = [12, 24, 36, 48, 60, 72, 84, 96, 108];
const DEFAULT_RATE = 4.88;

const calculateMonthlyPayment = (amount: number, months: number, rate: number) => {
  const totalInterest = (amount * rate * (months / 12)) / 100;
  return Math.round((amount + totalInterest) / months);
};

export default function PaymentTablePage() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then((response) => {
        if (!isMounted) return;
        if (response.success && response.data) {
          setProducts(response.data as Product[]);
        }
      })
      .catch(() => {
        // fallback to defaults
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const effectiveRate = useMemo(() => {
    if (!products.length) return DEFAULT_RATE;
    const minRate = products.reduce((acc, product) => {
      if (product.interestRate?.min) {
        return Math.min(acc, product.interestRate.min);
      }
      return acc;
    }, Number.POSITIVE_INFINITY);

    if (!Number.isFinite(minRate)) {
      return DEFAULT_RATE;
    }
    return Number(minRate.toFixed(2));
  }, [products]);

  const amountValues = useMemo(() => {
    if (!products.length) return DEFAULT_AMOUNTS;
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    products.forEach((product) => {
      if (product.loanAmount?.min) {
        min = Math.min(min, product.loanAmount.min);
      }
      if (product.loanAmount?.max) {
        max = Math.max(max, product.loanAmount.max);
      }
    });
    if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= min) {
      return DEFAULT_AMOUNTS;
    }
    const normalizedMin = Math.max(1000, Math.floor(min / 1000) * 1000);
    const normalizedMax = Math.ceil(max / 1000) * 1000;
    const desiredRows = 9;
    const rawStep = Math.max((normalizedMax - normalizedMin) / (desiredRows - 1), 5000);
    const step = Math.round(rawStep / 1000) * 1000 || 5000;
    const values: number[] = [];
    for (let amount = normalizedMin; amount <= normalizedMax && values.length < desiredRows; amount += step) {
      values.push(Math.round(amount / 1000) * 1000);
    }
    if (values[values.length - 1] !== normalizedMax) {
      values.push(normalizedMax);
    }
    return values;
  }, [products]);

  const tenureValues = useMemo(() => {
    if (!products.length) return DEFAULT_TENURES;
    const monthsSet = new Set<number>();
    products.forEach((product) => {
      if (product.tenure?.min) monthsSet.add(product.tenure.min);
      if (product.tenure?.max) monthsSet.add(product.tenure.max);
    });
    const months = Array.from(monthsSet).filter(Boolean).sort((a, b) => a - b);
    if (!months.length) return DEFAULT_TENURES;
    return months.slice(0, 9);
  }, [products]);

  const tableRows = useMemo(
    () =>
      amountValues.map((amount, index) => ({
        amount,
        featured: index === Math.floor(amountValues.length / 2),
        payments: tenureValues.map((months) => calculateMonthlyPayment(amount, months, effectiveRate)),
      })),
    [amountValues, tenureValues, effectiveRate]
  );

  const content = {
    en: {
      title: 'Monthly Payment Table',
      subtitle: '4.88% Interest Rate (Fixed)',
      description: 'Use this table to quickly find your estimated monthly payment based on loan amount and tenure.',
      loanAmount: 'Loan Amount',
      year: 'y',
      month: 'm',
      perMonth: '/mo',
      best: 'Popular',
      note: 'Note: This is an estimate only. Actual rates may vary based on your credit profile.',
      applyNow: 'Apply Now',
      calculator: 'Use Calculator',
    },
    ms: {
      title: 'Jadual Bayaran Bulanan',
      subtitle: 'Kadar Faedah 4.88% (Tetap)',
      description: 'Gunakan jadual ini untuk mencari anggaran bayaran bulanan anda berdasarkan jumlah pinjaman dan tempoh.',
      loanAmount: 'Jumlah Pinjaman',
      year: 't',
      month: 'b',
      perMonth: '/bln',
      best: 'Popular',
      note: 'Nota: Ini adalah anggaran sahaja. Kadar sebenar mungkin berbeza berdasarkan profil kredit anda.',
      applyNow: 'Mohon Sekarang',
      calculator: 'Guna Kalkulator',
    },
  };

  const t = content[lang];
  const subtitleText = t.subtitle.replace('4.88%', `${effectiveRate}%`);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY').format(value);
  };

  return (
    <div className="min-h-screen">
      <section className="hero-surface relative overflow-hidden py-16 md:py-20 text-white">
        <div className="hero-circuit opacity-50" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-medium text-sky-200">
              {subtitleText}
            </p>
            <h1 className="mb-4 text-3xl font-semibold md:text-4xl">
              {t.title}
            </h1>
            <p className="text-lg text-white/90">
              {t.description}
            </p>
          </div>
        </div>
      </section>

      <div className="container -mt-12 pb-16">
        <div className="wave-grid rounded-[36px] border border-white/70 bg-white/95 p-6 shadow-[0_25px_70px_rgba(6,18,45,0.12)] md:p-10">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-white text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <th className="p-4 align-bottom">
                    <span className="block text-base font-semibold tracking-normal text-foreground">
                      {t.loanAmount}
                    </span>
                  </th>
                  {tenureValues.map((months) => {
                    const years = months / 12;
                    const yearLabel = years >= 1 ? `${parseFloat(years.toFixed(1))}${t.year}` : `${months}${t.month}`;
                    return (
                      <th key={months} className="p-4 text-center align-bottom">
                        <div className="digital-display--dark text-base font-semibold text-foreground">
                          {yearLabel}
                        </div>
                        <div className="text-[11px] font-normal text-muted-foreground">
                          ({months}
                          {t.month})
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.amount}
                    className="border-b border-slate-100 last:border-none even:bg-slate-50/60"
                  >
                    <td className="p-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        {row.featured && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {t.best}
                          </span>
                        )}
                        <span className="digital-display--dark">
                          RM{formatCurrency(row.amount)}
                        </span>
                      </div>
                    </td>
                    {row.payments.map((payment, colIndex) => (
                      <td key={`${row.amount}-${colIndex}`} className="p-4 text-center">
                        <span className="digital-display--dark text-base font-semibold text-foreground">
                          RM{formatCurrency(payment)}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">{t.perMonth}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-primary/80">
              <span className="font-semibold">{lang === 'ms' ? 'Nota: ' : 'Note: '}</span>
              {t.note}
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={`/${locale}/apply`}>
                {t.applyNow}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary">
              <Link href={`/${locale}/calculator`}>
                {t.calculator}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
