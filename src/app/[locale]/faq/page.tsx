import { notFound } from 'next/navigation';
import FAQClient from './FaqClient';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { baseUrl } from '@/lib/site';

type FAQ = {
  _id: string;
  question: { en: string; ms: string };
  answer: { en: string; ms: string };
  category: string;
  order: number;
};

type Props = {
  params: Promise<{ locale: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  const res = await fetch(`${API_URL}/faqs`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();
  const faqs: FAQ[] = json?.data || [];

  if (!faqs.length) {
    notFound();
  }

  const schemaFaqs = faqs.slice(0, 20).map((faq) => ({
    question: faq.question[locale === 'ms' ? 'ms' : 'en'],
    answer: faq.answer[locale === 'ms' ? 'ms' : 'en'],
  }));

  const breadcrumbItems = [
    { name: locale === 'ms' ? 'Utama' : 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'ms' ? 'Soalan Lazim' : 'FAQ', url: `${baseUrl}/${locale}/faq` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={schemaFaqs} />
      <FAQClient initialFaqs={faqs} locale={locale} />
    </>
  );
}
