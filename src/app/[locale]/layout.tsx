import type { Metadata } from 'next';
import { baseUrl } from '@/lib/site';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import { Analytics } from '@vercel/analytics/react';
import { OrganizationSchema, LocalBusinessSchema } from '@/components/seo/StructuredData';
import { getSiteSettings } from '@/lib/server/siteSettings';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import '../globals.css';

const getLocalizedValue = (
  value?: { en?: string; ms?: string },
  locale: string = 'en'
) => {
  if (!value) return undefined;
  return locale === 'ms' ? value.ms || value.en || value.ms : value.en || value.ms;
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const settings = await getSiteSettings();
  const siteName = settings.siteName || 'SeaMoneeCredit';
  const title =
    getLocalizedValue(settings.seo?.defaultTitle, locale) ||
    'Personal Loan Malaysia | SeaMoneeCredit';
  const description =
    getLocalizedValue(settings.seo?.defaultDescription, locale) ||
    'Apply for personal or business loans in Malaysia with fast approval and competitive rates.';
  const keywords = settings.seo?.keywords?.length
    ? settings.seo?.keywords
    : ['personal loan malaysia', 'pinjaman peribadi', 'business loan', 'fast approval loan'];

  const localizedUrl = `${baseUrl}/${locale}`;
  const languageAlternates = locales.reduce<Record<string, string>>((acc, lang) => {
    acc[lang === 'ms' ? 'ms-MY' : 'en-MY'] = `${baseUrl}/${lang}`;
    return acc;
  }, {});

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: localizedUrl,
      siteName,
      locale: locale === 'ms' ? 'ms_MY' : 'en_MY',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: localizedUrl,
      languages: languageAlternates,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSiteSettings();

  return (
    <html lang={locale}>
      <head>
        <OrganizationSchema locale={locale} settings={settings} />
        <LocalBusinessSchema locale={locale} settings={settings} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SiteSettingsProvider initialSettings={settings}>
          <NextIntlClientProvider messages={messages}>
            <div className="relative flex min-h-screen flex-col">
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Header />
              <main id="main-content" className="flex-1 relative" tabIndex={-1}>
                {children}
              </main>
              <Footer />
              <WhatsAppButton />
              <AnalyticsTracker />
            </div>
          </NextIntlClientProvider>
        </SiteSettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
