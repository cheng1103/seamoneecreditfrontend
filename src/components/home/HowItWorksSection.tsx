'use client';

import { useTranslations } from 'next-intl';

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');

  const steps = [
    {
      step: '1',
      title: t('step1.title'),
      description: t('step1.description'),
    },
    {
      step: '2',
      title: t('step2.title'),
      description: t('step2.description'),
    },
    {
      step: '3',
      title: t('step3.title'),
      description: t('step3.description'),
    },
    {
      step: '4',
      title: t('step4.title'),
      description: t('step4.description'),
    },
  ];
  const phaseLabels = (t.raw('phases') as Record<string, string>) || {};
  const milestoneOrder = ['submit', 'verify', 'approve', 'disburse'];

  return (
    <section className="relative py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-[36px] bg-[#050e2b] px-6 py-12 text-white shadow-[0_30px_90px_rgba(3,9,24,0.8)]">
          <div className="hero-circuit opacity-50" aria-hidden="true" />
          <div className="relative z-10 mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">{t('title')}</p>
            <h2 className="mt-3 text-3xl font-bold text-gradient">{t('tagline')}</h2>
            <p className="mt-3 text-sm text-white/70">{t('description')}</p>
          </div>
          <div className="relative grid gap-6 md:grid-cols-4">
            <div className="absolute inset-x-10 top-16 hidden h-px bg-gradient-to-r from-transparent via-white/30 to-transparent md:block" />
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="group relative z-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(2,8,20,0.4)]">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {phaseLabels[milestoneOrder[index]] || milestoneOrder[index]}
                  </span>
                )}
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-sky-400/20 blur-2xl opacity-0 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
