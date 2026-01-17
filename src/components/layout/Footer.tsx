'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const siteName = settings.siteName || 'SeaMoneeCredit';
  const brandTagline = (locale === 'ms' ? settings.tagline?.ms : settings.tagline?.en) || t('tagline');
  const contact = settings.contact || {};
  const whatsappNumber = contact.whatsapp || contact.phone || '+60123456789';
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  const quickLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/about`, label: tNav('about') },
    { href: `/${locale}/calculator`, label: tNav('calculator') },
    { href: `/${locale}/payment-table`, label: tNav('paymentTable') },
    { href: `/${locale}/faq`, label: tNav('faq') },
    { href: `/${locale}/locations`, label: tNav('locations') },
    { href: `/${locale}/testimonials`, label: tNav('testimonials') },
    { href: `/${locale}/blog`, label: tNav('blog') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ];

  const products = [
    { href: `/${locale}/products/personal-loan`, label: tNav('personalLoan') },
    { href: `/${locale}/products/business-loan`, label: tNav('businessLoan') },
    { href: `/${locale}/products/car-loan`, label: tNav('carLoan') },
    { href: `/${locale}/products/education-loan`, label: tNav('educationLoan') },
  ];

  const insights = [
    { value: '4.9/5', label: t('insights.rating') },
    { value: '24h', label: t('insights.approval') },
    { value: 'RM200k', label: t('insights.maxFinancing') },
    { value: '100%', label: t('insights.transparentFees') },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#020b27] text-slate-200">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(17,103,255,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(2,19,48,0.8),_transparent_60%)]" />
      </div>
      <div className="container relative py-16 md:py-20">
        <div className="rounded-[32px] border border-white/15 bg-white/5 p-8 text-white shadow-[0_40px_100px_rgba(2,12,37,0.5)]">
          <div className="grid gap-6 md:grid-cols-[1.2fr_minmax(0,0.8fr)] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                {t('ctaEyebrow')}
              </p>
              <h3 className="mt-3 text-2xl font-semibold md:text-3xl">
                {t('ctaTitle', { brand: siteName })}
              </h3>
              <p className="mt-3 text-white/80">
                {t('ctaDescription')}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button asChild className="h-11 flex-1 rounded-2xl bg-white text-primary shadow-lg shadow-blue-500/30 sm:flex-none sm:px-8">
                <Link href={`/${locale}/apply`}>{tNav('apply')}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 flex-1 rounded-2xl border-white/50 text-white hover:bg-white/10 sm:flex-none sm:px-8"
              >
                <Link href={`/${locale}/contact`}>{t('contactUs')}</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-base font-bold text-white shadow-lg shadow-blue-500/40">
                {siteName.split(' ').map((word) => word.charAt(0)).join('').slice(0, 2).toUpperCase() || 'SM'}
              </div>
              <span className="text-lg font-semibold text-white">{siteName}</span>
            </Link>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">{brandTagline}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {insights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/15 bg-white/5 p-3 text-center">
                  <p className="text-lg font-semibold text-gradient">{item.value}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">{t('quickLinks')}</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">{t('loanProducts')}</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {products.map((product) => (
                <li key={product.href}>
                  <Link href={product.href} className="transition hover:text-white">
                    {product.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">{t('contactUs')}</h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              {contact.phone && (
                <li>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t('contactLabels.phone')}</p>
                  <a href={`tel:${contact.phone}`} className="font-medium text-white transition hover:text-sky-200">
                    {contact.phone}
                  </a>
                </li>
              )}
              {whatsappNumber && (
                <li>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t('contactLabels.whatsapp')}</p>
                  <a href={whatsappHref} className="font-medium text-white transition hover:text-sky-200">
                    {whatsappNumber}
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t('contactLabels.email')}</p>
                  <a href={`mailto:${contact.email}`} className="font-medium text-white transition hover:text-sky-200">
                    {contact.email}
                  </a>
                </li>
              )}
              {(locale === 'ms' ? contact.address?.ms : contact.address?.en) && (
                <li>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t('contactLabels.address')}</p>
                  <p className="text-sm text-slate-300">
                    {locale === 'ms' ? contact.address?.ms : contact.address?.en}
                  </p>
                </li>
              )}
              <li className="flex gap-4 pt-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-green-500"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>{t('copyright', { year: currentYear })}</p>
          <div className="flex flex-wrap gap-5">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-white">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white">
              {t('terms')}
            </Link>
            <Link href={`/${locale}/disclaimer`} className="hover:text-white">
              {t('disclaimer')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
