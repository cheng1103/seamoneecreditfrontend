import { MetadataRoute } from 'next';
import { getLocations } from '@/lib/server/locations';

import { baseUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'ms'];
  const staticPages = [
    '',
    '/products',
    '/products/personal-loan',
    '/products/business-loan',
    '/products/car-loan',
    '/products/education-loan',
    '/calculator',
    '/apply',
    '/blog',
    '/faq',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/payment-table',
    '/testimonials',
    '/locations',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages for each locale
  const locationEntries = await getLocations();

  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : page.includes('/products') ? 0.9 : 0.8,
      });
    });
    locationEntries.forEach((location) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/locations/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    });
  });

  // Add root redirect
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  return sitemapEntries;
}
