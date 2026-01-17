'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BreadcrumbSchema, ArticleSchema } from '@/components/seo/StructuredData';
import { baseUrl } from '@/lib/site';

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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BlogPage() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { en: 'All', ms: 'Semua', value: null },
    { en: 'Finance Tips', ms: 'Tips Kewangan', value: 'finance-tips' },
    { en: 'Loan Guide', ms: 'Panduan Pinjaman', value: 'loan-guide' },
    { en: 'News', ms: 'Berita', value: 'news' },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs?status=published`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt[lang].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ms' ? 'ms-MY' : 'en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const breadcrumbItems = [
    { name: lang === 'ms' ? 'Utama' : 'Home', url: `${baseUrl}/${locale}` },
    { name: lang === 'ms' ? 'Blog' : 'Blog', url: `${baseUrl}/${locale}/blog` },
  ];
  const schemaPosts = filteredPosts.length ? filteredPosts.slice(0, 3) : posts.slice(0, 3);

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbItems} />
      {schemaPosts.map((post) => (
        <ArticleSchema
          key={`schema-${post._id}`}
          title={post.title[lang]}
          description={post.excerpt[lang]}
          url={`${baseUrl}/${locale}/blog/${post.slug}`}
          image={post.featuredImage}
          datePublished={post.createdAt}
          dateModified={post.createdAt}
          author={post.author || 'SeaMoneeCredit'}
        />
      ))}
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-surface py-16 md:py-20 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200 mb-2">
              {lang === 'ms' ? 'Blog Kewangan' : 'Financial Blog'}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              {lang === 'ms' ? 'Tips & Panduan Kewangan' : 'Financial Tips & Guides'}
            </h1>
            <p className="text-lg text-white/85 mb-8">
              {lang === 'ms'
                ? 'Baca artikel terkini tentang pengurusan kewangan, tips pinjaman, dan banyak lagi.'
                : 'Read the latest articles about financial management, loan tips, and more.'}
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto rounded-full border border-white/30 bg-white/10 p-1 backdrop-blur">
              <Input
                type="text"
                placeholder={lang === 'ms' ? 'Cari artikel...' : 'Search articles...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-none bg-transparent text-center text-white placeholder:text-white/70 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container -mt-10 py-12">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 rounded-2xl border border-border bg-white p-4 shadow-lg">
          {categories.map((category) => (
            <Button
              key={category.value || 'all'}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category[lang]}
            </Button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="wave-card rounded-3xl overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {lang === 'ms'
                ? 'Tiada artikel dijumpai.'
                : 'No articles found.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/${locale}/blog/${post.slug}`}
                className="group wave-card rounded-3xl overflow-hidden border border-white/70 hover:border-primary transition-colors"
              >
                <div className="relative h-48">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title[lang]}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground/30">
                        {post.title[lang].charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold line-clamp-2 mb-2">
                    {post.title[lang]}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span>{formatDate(post.createdAt)}</span>
                    {post.readTime && (
                      <span>{post.readTime} {lang === 'ms' ? 'min baca' : 'min read'}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt[lang]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
