import { cache } from 'react';
import { getSiteSettings } from './siteSettings';
import { defaultLocations } from '@/data/locations';
import type { LocationEntry } from '@/types/site';

export const getLocations = cache(async (): Promise<LocationEntry[]> => {
  try {
    const settings = await getSiteSettings();
    if (settings.locations && settings.locations.length) {
      return settings.locations;
    }
  } catch (error) {
    console.error('Failed to load locations from settings:', error);
  }
  return defaultLocations;
});
