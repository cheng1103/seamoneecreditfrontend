import 'server-only';

import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type BlogPost = {
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
};

const fetchBlogBySlug = async (slug: string): Promise<{ post: BlogPost | null; related: BlogPost[] }> => {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return { post: null, related: [] };
    }
    const json = await res.json();
    return {
      post: (json?.data || null) as BlogPost | null,
      related: (json?.related || []) as BlogPost[],
    };
  } catch (error) {
    console.error('Failed to fetch blog', error);
    return { post: null, related: [] };
  }
};

export const getBlogBySlug = cache(fetchBlogBySlug);
