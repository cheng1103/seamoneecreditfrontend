'use client';

import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  Rocket,
  PanelsTopLeft,
  RefreshCcw,
} from 'lucide-react';

const iconMap = [ShieldCheck, Rocket, RefreshCcw, PanelsTopLeft];

export default function FeaturesSection() {
  const t = useTranslations('features');
  const highlights = t.raw('highlights') as Record<string, string>;

  const features = [
    {
      title: t('fastApproval.title'),
      description: t('fastApproval.description'),
      highlight: highlights?.fastApproval || '24h',
    },
    {
      title: t('lowRates.title'),
      description: t('lowRates.description'),
      highlight: highlights?.lowRates || '4.88%',
    },
    {
      title: t('flexibleTerms.title'),
      description: t('flexibleTerms.description'),
      highlight: highlights?.flexibleTerms || '10 yrs',
    },
    {
      title: t('easyProcess.title'),
      description: t('easyProcess.description'),
      highlight: highlights?.easyProcess || '3 steps',
    },
  ];

  return (
    <section className="relative py-16 md:py-20">
      <div className="hero-circuit opacity-20" aria-hidden="true" />
      <div className="container relative">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            {t('title')}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gradient">{t('headline')}</h2>
          <p className="mt-3 text-muted-foreground">{t('description')}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = iconMap[index] || ShieldCheck;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_30px_60px_rgba(6,18,45,0.08)] transition hover:-translate-y-1"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-blue-600 opacity-70"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary/80">
                    <span className="digital-display--dark text-base">{feature.highlight}</span>
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
