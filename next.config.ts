import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'seamoneecredit.com',
      },
      {
        protocol: 'https',
        hostname: 'api.seamoneecredit.com',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default withNextIntl(nextConfig);
