import 'server-only';

import { cache } from 'react';
import type { SiteSettings } from '@/types/site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const fetchSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const response = await fetch(`${API_URL}/content/settings`, {
      next: {
        revalidate: 3600, // revalidate every hour
      },
    });

    if (!response.ok) {
      if (response.status !== 403) {
        console.error('Failed to fetch site settings', response.statusText);
      }
      return {};
    }

    const json = await response.json();
    return (json?.data || {}) as SiteSettings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }
};

export const getSiteSettings = cache(fetchSiteSettings);
