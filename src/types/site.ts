export type LocalizedValue = {
  en?: string;
  ms?: string;
};

export interface LocationFaqEntry {
  question?: LocalizedValue;
  answer?: LocalizedValue;
}

export interface LocationEntry {
  slug: string;
  name: LocalizedValue;
  summary: LocalizedValue;
  address: LocalizedValue;
  phone?: string;
  whatsapp?: string;
  email?: string;
  hours?: LocalizedValue;
  mapEmbedUrl?: string;
  geo?: {
    lat?: number;
    lng?: number;
  };
  services?: LocalizedValue[];
  areasServed?: LocalizedValue[];
  faqs?: LocationFaqEntry[];
  ratingSummary?: {
    score?: number;
    count?: number;
  };
}

export interface SiteContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: LocalizedValue;
  googleMapsUrl?: string;
  geo?: {
    lat?: number;
    lng?: number;
  };
}

export interface SiteSettings {
  siteName?: string;
  tagline?: LocalizedValue;
  logo?: {
    light?: string;
    dark?: string;
  };
  contact?: SiteContact;
  social?: Record<string, string>;
  businessHours?: LocalizedValue;
  seo?: {
    defaultTitle?: LocalizedValue;
    defaultDescription?: LocalizedValue;
    keywords?: string[];
    aggregateRating?: {
      value?: number;
      count?: number;
    };
    googleVerification?: string;
  };
  legal?: {
    companyName?: string;
    registrationNumber?: string;
    licenseNumber?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  features?: {
    showWhatsappButton?: boolean;
    showLoanCalculator?: boolean;
    enableBlog?: boolean;
    enableTestimonials?: boolean;
  };
  locations?: LocationEntry[];
}
