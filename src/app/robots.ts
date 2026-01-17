import { MetadataRoute } from 'next';

import { baseUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/*/disclaimer',
          '/en/disclaimer',
          '/ms/disclaimer',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/*/disclaimer',
          '/en/disclaimer',
          '/ms/disclaimer',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
