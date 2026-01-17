'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, Sparkles, ArrowUpRight, LineChart, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const stats = ['speed', 'rate', 'amount'].map((key) => ({
    label: t(`stats.${key}.label`),
    value: t(`stats.${key}.value`),
    detail: t(`stats.${key}.detail`),
  }));
  const statIcons = [Sparkles, LineChart, CircleDollarSign];
  const cardCopy = {
    title: t('card.title'),
    subtitle: t('card.subtitle'),
    badge: t('card.badge'),
    rateLabel: t('card.rateLabel'),
    repaymentLabel: t('card.repaymentLabel'),
    disclaimer: t('card.disclaimer'),
    button: t('card.button'),
    sticker: t('card.sticker'),
  };

  return (
    <section className="relative overflow-hidden hero-surface py-16 md:py-24 lg:py-28">
      <div className="hero-circuit" aria-hidden="true" />
      <div className="hero-wave hero-wave--top" aria-hidden="true" />
      <div className="hero-wave" aria-hidden="true" />
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute -top-24 right-8 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl" />
      </div>
      <div className="container relative z-10 grid items-center gap-12 text-white lg:grid-cols-[1.1fr_minmax(0,0.85fr)]">
        <div className="space-y-8">
          <div className="digital-pill inline-flex items-center gap-2 border border-white/30 px-4 py-1 text-sm font-medium text-white/90 shadow-[0_15px_30px_rgba(4,11,34,0.45)]">
            <Sparkles className="h-4 w-4 text-sky-200" />
            <span>{t('pill')}</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="text-base text-slate-200 sm:text-lg">
              {t('subtitle')}{' '}
              <span className="font-semibold text-white">{t('rate')}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="px-8 shadow-[0_25px_60px_rgba(23,86,182,0.65)]">
              <Link href={`/${locale}/apply`} onClick={() => trackEvent('apply_click_hero')}>
                {t('cta')}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/60 bg-white/10 px-8 text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
            >
              <Link href={`/${locale}/calculator`}>
                {t('secondaryCta')}
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = statIcons[index] || ShieldCheck;
              return (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-5 text-left backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" aria-hidden="true" />
                <div className="relative space-y-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{stat.label}</p>
                    <p className="text-xs text-white/60">{stat.detail}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="glass-card border-glow relative z-10 rounded-3xl p-8 text-foreground shadow-lg shadow-blue-900/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{cardCopy.title}</p>
                <h3 className="digital-display mt-2 text-3xl font-bold text-primary">RM120,000</h3>
                <p className="text-sm text-muted-foreground">{cardCopy.subtitle}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                {cardCopy.badge}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  <LineChart className="h-4 w-4 text-primary" />
                  {cardCopy.rateLabel}
                </span>
                <span className="font-semibold text-foreground">4.88% p.a.</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                  {cardCopy.repaymentLabel}
                </span>
                <span className="font-semibold text-foreground">RM1,256</span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-muted/60 p-4">
              <p className="text-xs text-muted-foreground">{cardCopy.disclaimer}</p>
              <Button asChild size="sm" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center gap-2"
                  onClick={() => trackEvent('contact_click_hero')}
                >
                  {cardCopy.button}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="absolute -left-4 -top-4 z-20 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-xs uppercase tracking-wide text-white/90 shadow-lg">
            {cardCopy.sticker}
          </div>
        </div>
      </div>
    </section>
  );
}
