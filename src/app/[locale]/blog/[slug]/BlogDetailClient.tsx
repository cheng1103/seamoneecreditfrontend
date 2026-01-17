'use client';

import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { Button } from '@/components/ui/button';

interface BlogPost {
  _id: string;
  title: { en: string; ms: string };
  slug: string;
  excerpt: { en: string; ms: string };
  content: { en: string; ms: string };
  featuredImage?: string;
  category: string;
  tags: string[];
  author?: string;
  readTime?: number;
  createdAt: string;
  updatedAt?: string;
}

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
  locale: string;
}

const formatDate = (dateString: string, lang: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === 'ms' ? 'ms-MY' : 'en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogDetailClient({ post, relatedPosts, locale }: Props) {
  const lang = locale === 'ms' ? 'ms' : 'en';
  const sanitizedContent = DOMPurify.sanitize(post.content?.[lang] || post.content?.en || '', {
    USE_PROFILES: { html: true },
  });

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden hero-surface py-16 md:py-20 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container max-w-4xl relative">
          <Link
            href={`/${locale}/blog`}
            className="inline-block text-sm text-white/70 hover:text-white mb-6"
          >
            &larr; {lang === 'ms' ? 'Kembali ke Blog' : 'Back to Blog'}
          </Link>

          <span className="inline-block bg-white/15 text-white text-xs px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">{post.title[lang]}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            {post.author && <span>{post.author}</span>}
            <span>{formatDate(post.createdAt, lang)}</span>
            {post.readTime && (
              <span>{post.readTime} {lang === 'ms' ? 'min baca' : 'min read'}</span>
            )}
          </div>
        </div>
      </section>

      <div className="container max-w-4xl py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            {post.featuredImage && (
              <div className="relative h-64 md:h-96 mb-8 rounded-3xl overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title[lang]}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {lang === 'ms' ? 'Tag:' : 'Tags:'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">
                {lang === 'ms' ? 'Berkongsi Artikel Ini' : 'Share This Article'}
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window === 'undefined' ? '' : window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      typeof window === 'undefined' ? '' : window.location.href
                    )}&text=${encodeURIComponent(post.title[lang])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter / X
                  </a>
                </Button>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="wave-card rounded-2xl border p-6">
              <h3 className="text-lg font-semibold mb-3">
                {lang === 'ms' ? 'Berkaitan' : 'Related Posts'}
              </h3>
              <div className="space-y-4">
                {relatedPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {lang === 'ms' ? 'Tiada artikel berkaitan.' : 'No related articles.'}
                  </p>
                ) : (
                  relatedPosts.map((related) => (
                    <div key={related._id}>
                      <Link
                        href={`/${locale}/blog/${related.slug}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {related.title[lang]}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(related.createdAt, lang)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="neo-card-light rounded-2xl border bg-muted/30 p-6">
              <h3 className="text-lg font-semibold mb-3">
                {lang === 'ms' ? 'Perlu Bantuan?' : 'Need Help?'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {lang === 'ms'
                  ? 'Hubungi pakar pinjaman kami. Kami sedia membantu anda.'
                  : 'Get personalized advice from our loan specialists.'}
              </p>
              <Button asChild className="w-full">
                <Link href={`/${locale}/apply`}>{lang === 'ms' ? 'Mohon Sekarang' : 'Apply Now'}</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
