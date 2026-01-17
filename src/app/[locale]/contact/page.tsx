import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { baseUrl } from '@/lib/site';

export default function ContactPage() {
  return <ContactPageClient />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isMs = locale === 'ms';
  return {
    title: isMs ? 'Hubungi SeaMoneeCredit' : 'Contact SeaMoneeCredit',
    description: isMs
      ? 'Hubungi pasukan SeaMoneeCredit untuk pertanyaan pinjaman, status permohonan, atau sokongan pelanggan.'
      : 'Get in touch with SeaMoneeCredit for loan inquiries, application updates, or customer support.',
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
    },
  };
}
