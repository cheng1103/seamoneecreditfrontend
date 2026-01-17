import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { getProductBySlug } from '@/lib/server/products';
import { getLoanTypeTestimonialsServer } from '@/lib/server/testimonials';
import { ProductSchema } from '@/components/seo/StructuredData';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const getLocalizedValue = (
  value: { en?: string; ms?: string } | undefined,
  locale: string,
  fallback?: string
) => {
  if (!value) return fallback;
  return locale === 'ms' ? value.ms || value.en || fallback : value.en || value.ms || fallback;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const lang = locale === 'ms' ? 'ms' : 'en';
  const title =
    getLocalizedValue(product?.seo?.title, lang, product.name?.[lang] || product.slug) ||
    'SeaMoneeCredit';
  const description =
    getLocalizedValue(
      product?.seo?.description,
      lang,
      product.description?.[lang] || undefined
    ) || 'SeaMoneeCredit loan product';

  return {
    title,
    description,
  };
}

const buildRatingSummary = (testimonials: { rating?: number }[]) => {
  const withRatings = testimonials.filter(
    (testimonial) => typeof testimonial.rating === 'number' && (testimonial.rating ?? 0) > 0
  );
  if (!withRatings.length) {
    return null;
  }
  const total = withRatings.reduce((sum, testimonial) => sum + (testimonial.rating ?? 0), 0);
  return {
    score: total / withRatings.length,
    count: withRatings.length,
  };
};

export default async function ProductPage({ params }: Props) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const testimonials = await getLoanTypeTestimonialsServer(slug, 12);
  const ratingSummary = buildRatingSummary(testimonials);
  const enrichedProduct = ratingSummary ? { ...product, ratingSummary } : product;

  return (
    <>
      <ProductSchema product={enrichedProduct} locale={locale} />
      <ProductDetailClient product={enrichedProduct} locale={locale} testimonials={testimonials} />
    </>
  );
}
