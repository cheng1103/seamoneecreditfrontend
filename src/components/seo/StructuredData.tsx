'use client';

import Script from 'next/script';
import type { SiteSettings, LocationEntry } from '@/types/site';
import { defaultLocations } from '@/data/locations';
import { baseUrl } from '@/lib/site';

type LocalizedValue = { en?: string; ms?: string };
const defaultLogo = `${baseUrl}/brand/logo.png`;

const getAddressString = (contact?: SiteSettings['contact'], locale: string = 'en') => {
  const lang = locale === 'ms' ? 'ms' : 'en';
  if (contact?.address) {
    return contact.address[lang] || contact.address.en || contact.address.ms;
  }
  if (defaultLocations.length) {
    const fallback = defaultLocations[0].address;
    return fallback[lang as 'en' | 'ms'] || fallback.en;
  }
  return 'Level 10, Menara City, Jalan Ampang, 50450 Kuala Lumpur, Malaysia';
};

const getSiteName = (settings?: SiteSettings) => settings?.siteName || 'SeaMoneeCredit';
const resolveLocalized = (
  value?: { en?: string; ms?: string },
  locale: string = 'en',
  fallback?: string
) => {
  if (!value) return fallback;
  const lang = locale === 'ms' ? 'ms' : 'en';
  return value[lang] || value.en || value.ms || fallback;
};

interface OrganizationSchemaProps {
  locale?: string;
  settings?: SiteSettings;
}

export function OrganizationSchema({ locale = 'en', settings }: OrganizationSchemaProps) {
  const siteName = getSiteName(settings);
  const description =
    locale === 'ms'
      ? settings?.tagline?.ms ||
        'Perkhidmatan pinjaman peribadi dan perniagaan dengan kadar faedah kompetitif di Malaysia'
      : settings?.tagline?.en ||
        'Personal and business loan services with competitive interest rates in Malaysia';
  const phone = settings?.contact?.phone || '+60312345678';
  const email = settings?.contact?.email || 'info@seamoneecredit.com';
  const logo = settings?.logo?.light || settings?.logo?.dark || defaultLogo;
  const address = getAddressString(settings?.contact, locale);
  const lat = settings?.contact?.geo?.lat ?? 3.1516;
  const lng = settings?.contact?.geo?.lng ?? 101.7033;
  const aggregateRatingValue = settings?.seo?.aggregateRating?.value ?? 4.9;
  const aggregateRatingCount = settings?.seo?.aggregateRating?.count ?? 120;
  const locationEntries = settings?.locations?.length ? settings.locations : defaultLocations;
  const areaServedList = Array.from(
    new Set(
      locationEntries
        .flatMap((location) =>
          location.areasServed?.map((area) => resolveLocalized(area, locale)).filter(Boolean) || []
        )
        .filter(Boolean)
    )
  );
  const contactPoints = [
    {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer support',
      areaServed: areaServedList.length ? areaServedList : 'Malaysia',
      availableLanguage: ['English', 'Malay'],
      email,
    },
    ...locationEntries
      .filter((location) => location.phone)
      .map((location) => ({
        '@type': 'ContactPoint',
        telephone: location.phone,
        contactType: 'branch office',
        areaServed:
          location.areasServed
            ?.map((area) => resolveLocalized(area, locale))
            .filter(Boolean) || undefined,
        availableLanguage: ['English', 'Malay'],
      })),
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: siteName,
    alternateName: siteName,
    url: 'https://seamoneecredit.com',
    logo,
    description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
      streetAddress: address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    telephone: phone,
    email,
    openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-13:00'],
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Malaysia',
    },
    sameAs: [
      'https://www.facebook.com/seamoneecredit',
      'https://www.instagram.com/seamoneecredit',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRatingValue,
      reviewCount: aggregateRatingCount,
      bestRating: 5,
      worstRating: 1,
    },
    contactPoint: contactPoints,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'ms' ? 'Produk Pinjaman' : 'Loan Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'LoanOrCredit',
            name: locale === 'ms' ? 'Pinjaman Peribadi' : 'Personal Loan',
            description:
              locale === 'ms'
                ? 'Pinjaman peribadi dengan kadar faedah serendah 4.88% p.a.'
                : 'Personal loan with interest rates as low as 4.88% p.a.',
            loanTerm: {
              '@type': 'QuantitativeValue',
              minValue: 12,
              maxValue: 120,
              unitCode: 'MON',
            },
            amount: {
              '@type': 'MonetaryAmount',
              minValue: 5000,
              maxValue: 200000,
              currency: 'MYR',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'LoanOrCredit',
            name: locale === 'ms' ? 'Pinjaman Perniagaan' : 'Business Loan',
            description:
              locale === 'ms'
                ? 'Pembiayaan PKS untuk mengembangkan perniagaan anda'
                : 'SME financing to grow your business',
            loanTerm: {
              '@type': 'QuantitativeValue',
              minValue: 12,
              maxValue: 84,
              unitCode: 'MON',
            },
            amount: {
              '@type': 'MonetaryAmount',
              minValue: 10000,
              maxValue: 500000,
              currency: 'MYR',
            },
          },
        },
      ],
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: { question: string; answer: string }[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = 'SeaMoneeCredit',
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    image: image || 'https://seamoneecredit.com/og-image.jpg',
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SeaMoneeCredit',
      logo: {
        '@type': 'ImageObject',
        url: defaultLogo,
      },
    },
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  product: {
    slug: string;
    name?: LocalizedValue;
    description?: LocalizedValue;
    loanAmount?: { min?: number; max?: number };
    interestRate?: { min?: number; max?: number; type?: string };
    tenure?: { min?: number; max?: number };
    ratingSummary?: { score?: number; count?: number };
  };
  locale?: string;
}

export function ProductSchema({ product, locale = 'en' }: ProductSchemaProps) {
  if (!product) return null;

  const lang = locale === 'ms' ? 'ms' : 'en';
  const name = resolveLocalized(product.name, lang, product.slug);
  const description =
    resolveLocalized(product.description, lang) ||
    (lang === 'ms'
      ? 'Pinjaman SeaMoneeCredit dengan kadar faedah kompetitif.'
      : 'SeaMoneeCredit loan product with competitive rates.');
  const url = `${baseUrl}/${lang}/products/${product.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LoanOrCredit',
    name,
    description,
    url,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'MYR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        priceCurrency: 'MYR',
        minPrice: product.loanAmount?.min || 0,
        maxPrice: product.loanAmount?.max || undefined,
      },
    },
    loanTerm: product.tenure
      ? {
          '@type': 'QuantitativeValue',
          minValue: product.tenure.min,
          maxValue: product.tenure.max,
          unitCode: 'MON',
        }
      : undefined,
    interestRate: product.interestRate?.min,
    additionalType: product.interestRate?.type,
    aggregateRating: product.ratingSummary
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.ratingSummary.score,
          reviewCount: product.ratingSummary.count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };

  return (
    <Script
      id={`product-schema-${product.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface TestimonialsSchemaProps {
  testimonials: Array<{
    name: string;
    content: { en?: string; ms?: string };
    rating?: number;
    loanType?: string;
    location?: string;
    branchSlug?: string;
    createdAt?: string;
  }>;
  locale?: string;
  locations?: LocationEntry[];
}

export function TestimonialsSchema({
  testimonials,
  locale = 'en',
  locations = defaultLocations,
}: TestimonialsSchemaProps) {
  if (!testimonials?.length) {
    return null;
  }

  const lang = locale === 'ms' ? 'ms' : 'en';
  const schema = testimonials.slice(0, 10).map((testimonial) => {
    const branch = testimonial.branchSlug
      ? locations.find((loc) => loc.slug === testimonial.branchSlug)
      : undefined;
    const itemReviewed = branch
      ? {
          '@type': 'FinancialService',
          name: resolveLocalized(branch.name, locale, branch.slug),
          areaServed:
            branch.areasServed?.map((area) => resolveLocalized(area, locale)) || ['Malaysia'],
          url: `${baseUrl}/${locale}/locations/${branch.slug}`,
        }
      : {
          '@type': 'FinancialProduct',
          name:
            testimonial.loanType ||
            (lang === 'ms' ? 'Pinjaman SeaMoneeCredit' : 'SeaMoneeCredit Loan'),
          areaServed: 'Malaysia',
        };

    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: testimonial.name,
    },
    reviewBody: testimonial.content?.[lang] || testimonial.content?.en || '',
    reviewRating: testimonial.rating
      ? {
          '@type': 'Rating',
          ratingValue: Math.min(5, Math.max(1, testimonial.rating)),
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
      itemReviewed,
      datePublished: testimonial.createdAt
        ? new Date(testimonial.createdAt).toISOString()
        : undefined,
    };
  });

  return (
    <Script
      id="testimonials-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface TestimonialsAggregateSchemaProps {
  locale?: string;
  ratingValue: number;
  reviewCount: number;
  branchSlug?: string | null;
  locations?: LocationEntry[];
}

export function TestimonialsAggregateSchema({
  locale = 'en',
  ratingValue,
  reviewCount,
  branchSlug,
  locations = defaultLocations,
}: TestimonialsAggregateSchemaProps) {
  if (!ratingValue || !reviewCount) {
    return null;
  }
  const lang = locale === 'ms' ? 'ms' : 'en';
  const branch =
    branchSlug && locations.length ? locations.find((loc) => loc.slug === branchSlug) : undefined;
  const targetUrl = branch
    ? `${baseUrl}/${locale}/locations/${branch.slug}`
    : `${baseUrl}/${locale}/testimonials`;
  const targetName = branch
    ? resolveLocalized(branch.name, locale, branch.slug)
    : lang === 'ms'
      ? 'Testimoni SeaMoneeCredit'
      : 'SeaMoneeCredit Testimonials';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: targetName,
    url: targetUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <Script
      id="testimonials-aggregate-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface LocationSchemaProps {
  location: {
    slug: string;
    name: LocalizedValue;
    address: LocalizedValue;
    phone?: string;
    whatsapp?: string;
    geo?: { lat?: number; lng?: number };
    services?: LocalizedValue[];
    areasServed?: LocalizedValue[];
    ratingSummary?: { score?: number; count?: number };
  };
  locale?: string;
}

export function LocationSchema({ location, locale = 'en' }: LocationSchemaProps) {
  const lang = locale === 'ms' ? 'ms' : 'en';
  const name = resolveLocalized(location.name, lang, location.slug);
  const address = resolveLocalized(location.address, lang);
  const serviceOffered = location.services?.map((service) => resolveLocalized(service, locale));
  const areaServed =
    location.areasServed?.map((area) => resolveLocalized(area, locale)) || ['Malaysia'];
  const aggregateRating = location.ratingSummary
    ? {
        '@type': 'AggregateRating',
        ratingValue: location.ratingSummary.score,
        reviewCount: location.ratingSummary.count,
        bestRating: 5,
        worstRating: 1,
      }
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressCountry: 'MY',
    },
    telephone: location.phone,
    url: `${baseUrl}/${locale}/locations/${location.slug}`,
    areaServed,
    serviceOffered,
    aggregateRating,
    geo: location.geo?.lat
      ? {
          '@type': 'GeoCoordinates',
          latitude: location.geo.lat,
          longitude: location.geo.lng,
        }
      : undefined,
  };

  return (
    <Script
      id={`location-schema-${location.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface LocalBusinessSchemaProps {
  locale?: string;
  settings?: SiteSettings;
}

export function LocalBusinessSchema({ locale = 'en', settings }: LocalBusinessSchemaProps) {
  const lang = locale === 'ms' ? 'ms' : 'en';
  const siteName = getSiteName(settings);
  const phone = settings?.contact?.phone || '+60312345678';
  const email = settings?.contact?.email || 'info@seamoneecredit.com';
  const logo = settings?.logo?.light || settings?.logo?.dark || defaultLogo;
  const address = getAddressString(settings?.contact, locale);
  const lat = settings?.contact?.geo?.lat ?? 3.1516;
  const lng = settings?.contact?.geo?.lng ?? 101.7033;
  const aggregateRatingValue = settings?.seo?.aggregateRating?.value;
  const aggregateRatingCount = settings?.seo?.aggregateRating?.count;
  const aggregateRating =
    typeof aggregateRatingValue === 'number'
      ? {
          '@type': 'AggregateRating',
          ratingValue: aggregateRatingValue,
          reviewCount: aggregateRatingCount ?? 0,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;
  const socialLinks = Object.values(settings?.social || {}).filter(
    (value) => typeof value === 'string' && value.trim().length > 0
  );
  const locationEntries = settings?.locations?.length ? settings.locations : defaultLocations;
  const departments = locationEntries.map((location) => {
    const name = resolveLocalized(location.name, locale, location.slug);
    const streetAddress = resolveLocalized(location.address, locale);
    const areaServed =
      location.areasServed
        ?.map((area) => resolveLocalized(area, locale))
        .filter(Boolean) || undefined;
    return {
      '@type': 'FinancialService',
      name,
      url: `${baseUrl}/${locale}/locations/${location.slug}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress,
        addressCountry: 'MY',
      },
      telephone: location.phone || phone,
      areaServed,
      aggregateRating: location.ratingSummary
        ? {
            '@type': 'AggregateRating',
            ratingValue: location.ratingSummary.score,
            reviewCount: location.ratingSummary.count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
      geo:
        location.geo?.lat && location.geo?.lng
          ? {
              '@type': 'GeoCoordinates',
              latitude: location.geo.lat,
              longitude: location.geo.lng,
            }
          : undefined,
    };
  });
  const areaServedNames = Array.from(
    new Set(
      departments
        .flatMap((department) => department.areaServed || [])
        .filter((value): value is string => Boolean(value))
    )
  );
  const openingHoursText =
    settings?.businessHours?.[lang] ||
    settings?.businessHours?.en ||
    (lang === 'ms'
      ? 'Isnin - Jumaat: 9:00 PG - 6:00 PTG'
      : 'Monday - Friday: 9:00 AM - 6:00 PM');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://seamoneecredit.com',
    name: siteName,
    image: logo,
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
      streetAddress: address,
    },
    areaServed: areaServedNames.length ? areaServedNames : { '@type': 'Country', name: 'Malaysia' },
    sameAs: socialLinks.length ? socialLinks : undefined,
    aggregateRating,
    openingHours: [openingHoursText],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    hasMap: settings?.contact?.googleMapsUrl || undefined,
    url: 'https://seamoneecredit.com',
    priceRange: '$$',
    paymentAccepted: 'Cash, Bank Transfer',
    currenciesAccepted: 'MYR',
    department: departments.length ? departments : undefined,
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface LocationsListSchemaProps {
  locale?: string;
  entries?: LocationEntry[];
}

export function LocationsListSchema({ locale = 'en', entries = defaultLocations }: LocationsListSchemaProps) {
  if (!entries.length) {
    return null;
  }
  const lang = locale === 'ms' ? 'ms' : 'en';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name:
      lang === 'ms'
        ? 'Senarai cawangan SeaMoneeCredit di Malaysia'
        : 'SeaMoneeCredit branches across Malaysia',
    itemListOrder: 'http://schema.org/ItemListOrderAscending',
    itemListElement: entries.map((location, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialService',
        name: location.name[lang as 'en' | 'ms'] || location.name.en,
        url: `${baseUrl}/${locale}/locations/${location.slug}`,
        telephone: location.phone,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'MY',
          streetAddress: location.address[lang as 'en' | 'ms'] || location.address.en,
        },
        aggregateRating: location.ratingSummary
          ? {
              '@type': 'AggregateRating',
              ratingValue: location.ratingSummary.score,
              reviewCount: location.ratingSummary.count,
              bestRating: 5,
              worstRating: 1,
            }
          : undefined,
        geo: location.geo?.lat
          ? {
              '@type': 'GeoCoordinates',
              latitude: location.geo.lat,
              longitude: location.geo.lng,
            }
          : undefined,
      },
    })),
  };

  return (
    <Script
      id="locations-list-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToSchemaProps {
  name: string;
  description?: string;
  steps: { name: string; text: string }[];
}

export function HowToSchema({ name, description, steps }: HowToSchemaProps) {
  if (!steps.length) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
