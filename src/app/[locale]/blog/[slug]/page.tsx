import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';
import { getBlogBySlug } from '@/lib/server/blogs';
import { ArticleSchema } from '@/components/seo/StructuredData';
import { baseUrl } from '@/lib/site';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const resolveLocalized = (
  value?: { en?: string; ms?: string },
  locale: string = 'en',
  fallback?: string
) => {
  if (!value) return fallback;
  return locale === 'ms' ? value.ms || value.en || fallback : value.en || value.ms || fallback;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { post } = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | SeaMoneeCredit',
    };
  }

  const lang = locale === 'ms' ? 'ms' : 'en';
  const title = resolveLocalized(post.title, lang, post.slug) || 'SeaMoneeCredit';
  const description =
    resolveLocalized(post.excerpt, lang, post.content?.[lang])?.slice(0, 160) ||
    'SeaMoneeCredit blog article';
  const url = `${baseUrl}/${locale}/blog/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const { post, related } = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const lang = locale === 'ms' ? 'ms' : 'en';
  const canonical = `${baseUrl}/${locale}/blog/${post.slug}`;

  return (
    <>
      <ArticleSchema
        title={post.title[lang]}
        description={post.excerpt?.[lang] || post.title[lang]}
        url={canonical}
        image={post.featuredImage}
        datePublished={post.createdAt}
        dateModified={post.updatedAt || post.createdAt}
      />
      <BlogDetailClient post={post} relatedPosts={related} locale={locale} />
    </>
  );
}
