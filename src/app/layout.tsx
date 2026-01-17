import type { Metadata, Viewport } from 'next';
import { baseUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'SeaMoneeCredit - Personal Loan Malaysia | Fast Approval from 4.88%',
    template: '%s | SeaMoneeCredit',
  },
  description:
    'Apply for personal loan in Malaysia with interest rates from 4.88% p.a. Fast 24-hour approval, loan up to RM200,000. Licensed money lender in Malaysia.',
  keywords: [
    'personal loan malaysia',
    'pinjaman peribadi',
    'business loan malaysia',
    'pinjaman perniagaan',
    'car loan malaysia',
    'pinjaman kereta',
    'low interest loan',
    'fast approval loan',
    'licensed money lender',
    'CTOS loan',
  ],
  authors: [{ name: 'SeaMoneeCredit' }],
  creator: 'SeaMoneeCredit',
  publisher: 'SeaMoneeCredit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'SeaMoneeCredit - Personal Loan Malaysia',
    description: 'Fast approval personal loan with rates from 4.88% p.a. Apply online now!',
    url: 'https://seamoneecredit.com',
    siteName: 'SeaMoneeCredit',
    locale: 'en_MY',
    alternateLocale: 'ms_MY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeaMoneeCredit - Personal Loan Malaysia',
    description: 'Fast approval personal loan with rates from 4.88% p.a.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://seamoneecredit.com',
    languages: {
      'en-MY': 'https://seamoneecredit.com/en',
      'ms-MY': 'https://seamoneecredit.com/ms',
    },
  },
  icons: {
    icon: [
      {
        url: '/brand/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: ['/brand/logo.png'],
    apple: [
      {
        url: '/brand/logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
