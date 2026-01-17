import 'server-only';

import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type TestimonialResponse = {
  _id: string;
  name: string;
  location?: string;
  rating?: number;
  content: { en?: string; ms?: string };
  loanType?: string;
  branchSlug?: string;
};

const fetchFeaturedTestimonials = async (): Promise<TestimonialResponse[]> => {
  try {
    const res = await fetch(`${API_URL}/testimonials/featured`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return (json?.data || []) as TestimonialResponse[];
  } catch (error) {
    console.error('Failed to fetch testimonials', error);
    return [];
  }
};

export const getFeaturedTestimonialsServer = cache(fetchFeaturedTestimonials);

const fetchTestimonialsByBranch = async (branchSlug: string, limit = 6): Promise<TestimonialResponse[]> => {
  try {
    const params = new URLSearchParams({
      branchSlug,
      limit: String(limit),
    });
    const res = await fetch(`${API_URL}/testimonials?${params.toString()}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return (json?.data || []) as TestimonialResponse[];
  } catch (error) {
    console.error(`Failed to fetch testimonials for branch ${branchSlug}`, error);
    return [];
  }
};

export const getBranchTestimonialsServer = cache(fetchTestimonialsByBranch);

const fetchTestimonialsByLoanType = async (loanType: string, limit = 12): Promise<TestimonialResponse[]> => {
  try {
    const params = new URLSearchParams({
      loanType,
      limit: String(limit),
    });
    const res = await fetch(`${API_URL}/testimonials?${params.toString()}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return (json?.data || []) as TestimonialResponse[];
  } catch (error) {
    console.error(`Failed to fetch testimonials for loan type ${loanType}`, error);
    return [];
  }
};

export const getLoanTypeTestimonialsServer = cache(fetchTestimonialsByLoanType);

const fetchAggregateRatings = async (loanTypes?: string[]): Promise<
  Record<
    string,
    {
      score: number;
      count: number;
    }
  >
> => {
  try {
    const params = new URLSearchParams();
    if (loanTypes?.length) {
      params.set('loanTypes', loanTypes.join(','));
    }
    const res = await fetch(
      `${API_URL}/testimonials/aggregates${params.toString() ? `?${params.toString()}` : ''}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) {
      return {};
    }
    const json = await res.json();
    return json?.data || {};
  } catch (error) {
    console.error('Failed to fetch testimonial aggregates', error);
    return {};
  }
};

export const getTestimonialsAggregateServer = cache(fetchAggregateRatings);
