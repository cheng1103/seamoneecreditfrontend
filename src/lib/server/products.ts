import 'server-only';

import { cache } from 'react';
import { getTestimonialsAggregateServer } from './testimonials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type ProductResponse = {
  _id: string;
  slug: string;
  name: { en?: string; ms?: string };
  description?: { en?: string; ms?: string };
  shortDescription?: { en?: string; ms?: string };
  features?: Array<{ en?: string; ms?: string }>;
  requirements?: Array<{ en?: string; ms?: string }>;
  documents?: Array<{ en?: string; ms?: string }>;
  loanAmount?: { min?: number; max?: number };
  interestRate?: { min?: number; max?: number; type?: string };
  tenure?: { min?: number; max?: number };
  ctosFee?: number;
  seo?: {
    title?: { en?: string; ms?: string };
    description?: { en?: string; ms?: string };
  };
  ratingSummary?: {
    score?: number;
    count?: number;
  };
};

const fallbackProducts: ProductResponse[] = [
  {
    _id: 'fallback-personal-loan',
    slug: 'personal-loan',
    name: { en: 'Personal Loan' },
    description: {
      en: 'Flexible personal financing for home upgrades, medical bills, education, or debt consolidation with transparent rates.',
    },
    shortDescription: {
      en: 'Fast approval, flexible tenure, and no collateral.',
    },
    features: [
      { en: 'Rates from 4.88% p.a. (flat)' },
      { en: 'Loan up to RM200,000' },
      { en: 'Tenure up to 10 years' },
      { en: 'Approval in 24 to 48 hours' },
      { en: 'No collateral required' },
    ],
    requirements: [
      { en: 'Malaysian citizen or PR' },
      { en: 'Age 21 to 60' },
      { en: 'Monthly income from RM2,000' },
      { en: 'Employed for at least 6 months' },
    ],
    documents: [
      { en: 'MyKad (front and back)' },
      { en: 'Latest 3 months payslips' },
      { en: 'Latest 3 months bank statements' },
      { en: 'Employment confirmation letter' },
    ],
    loanAmount: { min: 5000, max: 200000 },
    interestRate: { min: 4.88, max: 18, type: 'flat' },
    tenure: { min: 12, max: 120 },
    ctosFee: 30,
    ratingSummary: { score: 4.9, count: 120 },
  },
  {
    _id: 'fallback-business-loan',
    slug: 'business-loan',
    name: { en: 'Business Loan' },
    description: {
      en: 'SME financing for working capital, equipment, and expansion with tailored repayment plans.',
    },
    shortDescription: {
      en: 'Support cash flow with flexible business terms.',
    },
    features: [
      { en: 'Loan up to RM500,000' },
      { en: 'Flexible repayment schedule' },
      { en: 'Fast documentation review' },
      { en: 'Dedicated SME advisor' },
      { en: 'Minimal collateral for eligible profiles' },
    ],
    requirements: [
      { en: 'SSM registered business' },
      { en: '2+ years operating history' },
      { en: 'Annual revenue RM100,000 or higher' },
      { en: 'Clean business credit record' },
    ],
    documents: [
      { en: 'SSM registration documents' },
      { en: 'Business bank statements (6 months)' },
      { en: 'Latest financial statements' },
      { en: 'Company profile and director IC' },
    ],
    loanAmount: { min: 10000, max: 500000 },
    interestRate: { min: 6, max: 18, type: 'flat' },
    tenure: { min: 12, max: 84 },
    ctosFee: 30,
    ratingSummary: { score: 4.7, count: 85 },
  },
  {
    _id: 'fallback-auto-loan',
    slug: 'car-loan',
    name: { en: 'Car Loan' },
    description: {
      en: 'Affordable financing for new or used vehicles with competitive rates and flexible tenure options.',
    },
    shortDescription: {
      en: 'Drive your dream car with confidence.',
    },
    features: [
      { en: 'Finance up to 90% of vehicle value' },
      { en: 'Tenure up to 9 years' },
      { en: 'Competitive interest rates' },
      { en: 'Quick approval turnaround' },
      { en: 'New and used cars supported' },
    ],
    requirements: [
      { en: 'Malaysian citizen or PR' },
      { en: 'Age 21 to 65' },
      { en: 'Monthly income from RM2,500' },
      { en: 'Stable employment or business income' },
    ],
    documents: [
      { en: 'MyKad copy' },
      { en: 'Latest 3 months payslips' },
      { en: 'Latest 3 months bank statements' },
      { en: 'Vehicle purchase agreement' },
    ],
    loanAmount: { min: 20000, max: 300000 },
    interestRate: { min: 3.2, max: 9, type: 'flat' },
    tenure: { min: 12, max: 108 },
    ctosFee: 30,
    ratingSummary: { score: 4.6, count: 64 },
  },
  {
    _id: 'fallback-home-loan',
    slug: 'home-loan',
    name: { en: 'Home Loan' },
    description: {
      en: 'Home financing for new purchases or refinancing with competitive reducing rate options.',
    },
    shortDescription: {
      en: 'Long-term financing with stable monthly payments.',
    },
    features: [
      { en: 'Loan up to RM1,000,000' },
      { en: 'Tenure up to 30 years' },
      { en: 'Reducing balance rates available' },
      { en: 'Flexible early settlement options' },
      { en: 'Support for first-time buyers' },
    ],
    requirements: [
      { en: 'Malaysian citizen or PR' },
      { en: 'Age 21 to 65 at loan maturity' },
      { en: 'Minimum income RM3,000' },
      { en: 'Valid property Sale and Purchase agreement' },
    ],
    documents: [
      { en: 'MyKad (front and back)' },
      { en: 'Latest 3 months payslips' },
      { en: 'Latest 6 months bank statements' },
      { en: 'Property SPA and valuation report' },
    ],
    loanAmount: { min: 50000, max: 1000000 },
    interestRate: { min: 3.5, max: 5.8, type: 'reducing' },
    tenure: { min: 60, max: 360 },
    ctosFee: 30,
    ratingSummary: { score: 4.8, count: 96 },
  },
  {
    _id: 'fallback-education-loan',
    slug: 'education-loan',
    name: { en: 'Education Loan' },
    description: {
      en: 'Cover tuition, living expenses, and learning tools with an education loan designed for students and parents.',
    },
    shortDescription: {
      en: 'Invest in education with deferred repayment options.',
    },
    features: [
      { en: 'Tuition and living expenses covered' },
      { en: 'Flexible repayment after graduation' },
      { en: 'Interest-only period available' },
      { en: 'Local and overseas programs supported' },
      { en: 'Optional guarantor support' },
    ],
    requirements: [
      { en: 'Offer letter from institution' },
      { en: 'Guarantor with stable income' },
      { en: 'Age 18 to 55' },
      { en: 'Proof of enrollment and course details' },
    ],
    documents: [
      { en: 'Offer letter' },
      { en: 'MyKad copies (applicant and guarantor)' },
      { en: 'Income proof for guarantor' },
      { en: 'Latest academic records (if required)' },
    ],
    loanAmount: { min: 10000, max: 150000 },
    interestRate: { min: 4.5, max: 9.5, type: 'flat' },
    tenure: { min: 12, max: 120 },
    ctosFee: 30,
    ratingSummary: { score: 4.8, count: 72 },
  },
];

const fetchProduct = async (slug: string): Promise<ProductResponse | null> => {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return fallbackProducts.find((product) => product.slug === slug) || null;
    }

    const json = await res.json();
    return (json?.data || null) as ProductResponse | null;
  } catch (error) {
    console.error('Failed to fetch product', error);
    return fallbackProducts.find((product) => product.slug === slug) || null;
  }
};

export const getProductBySlug = cache(fetchProduct);

const fetchProductsList = async (): Promise<ProductResponse[]> => {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return fallbackProducts;
    }
    const json = await res.json();
    const products = (json?.data || []) as ProductResponse[];
    if (!products.length) {
      return fallbackProducts;
    }
    const aggregates = await getTestimonialsAggregateServer(
      products.map((product) => product.slug).filter(Boolean)
    );
    return products.map((product) => ({
      ...product,
      ratingSummary: aggregates[product.slug] || product.ratingSummary,
    }));
  } catch (error) {
    console.error('Failed to fetch products', error);
    return [];
  }
};

export const getProductsServer = cache(fetchProductsList);
