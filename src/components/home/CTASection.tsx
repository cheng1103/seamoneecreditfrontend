'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, Phone, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { trackEvent } from '@/lib/analytics';

export default function CTASection() {
  const t = useTranslations('cta');
  const locale = useLocale();
  const { settings } = useSiteSettings();
  const phoneNumber = settings.contact?.phone || settings.contact?.whatsapp || '+60 3-1234 5678';
  const cards = ['licensed', 'specialist'].map((key) => ({
    title: t(`cards.${key}.title`),
    subtitle: t(`cards.${key}.subtitle`),
  }));
  const metrics = [
    { label: t('metrics.approval.label'), value: t('metrics.approval.value') },
    { label: t('metrics.rate.label'), value: t('metrics.rate.value') },
  ];
  const steps = (t.raw('journeySteps') as string[]) ?? [];

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-cta)' }} />
      <div className="hero-circuit opacity-30" aria-hidden="true" />
      <div className="hero-wave hero-wave--top" aria-hidden="true" />
      <div className="hero-wave" aria-hidden="true" />
      <div className="absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]" />
      </div>
      <div className="container relative z-10 text-white">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
              {t('pill')}
            </div>
            <div>
              <h2 className="text-3xl font-semibold md:text-4xl">{t('title')}</h2>
              <p className="mt-4 text-lg text-white/90">{t('subtitle')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map((card, index) => {
                const Icon = index === 0 ? ShieldCheck : Phone;
                return (
                  <div key={card.title} className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-white/90">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{card.title}</p>
                        <p className="text-xs text-white/80">{card.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="px-8 shadow-lg shadow-blue-900/30">
                <Link href={`/${locale}/apply`} onClick={() => trackEvent('apply_click_cta')}>
                  {t('button')}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 text-white border-white/50 hover:bg-white/10"
              >
                <Link href={`/${locale}/contact`} onClick={() => trackEvent('contact_click_cta')}>
                  {t('contactButton')}
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/25 bg-white/10 p-6 shadow-2xl shadow-blue-900/40 backdrop-blur">
            <div className="space-y-6 text-sm text-white/80">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <span>{metric.label}</span>
                  <strong className="digital-display text-xl">{metric.value}</strong>
                </div>
              ))}
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t('journeyTitle')}</p>
                <ul className="mt-3 space-y-3 text-white">
                  {steps.map((step) => (
                    <li key={step} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-white/70">{t('help', { phone: phoneNumber })}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
