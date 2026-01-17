import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/lib/api';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { defaultLocations } from '@/data/locations';
import type { SiteSettings } from '@/types/site';

const defaultSettings: SiteSettings = {
  siteName: 'SeaMoneeCredit',
  logo: {
    light: '/brand/logo.png',
    dark: '/brand/logo.png',
  },
  contact: {
    phone: '+60 3-2710 8888',
    whatsapp: '+60 11-1234 8888',
    email: 'info@seamoneecredit.com',
    address: {
      en: 'Level 35, Menara City, Jalan Ampang, 50450 Kuala Lumpur, Malaysia',
      ms: 'Tingkat 35, Menara City, Jalan Ampang, 50450 Kuala Lumpur, Malaysia',
    },
    googleMapsUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0233374090897!2d101.69236347609481!3d3.152481153251457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc36260c358221%3A0x8bb2745078e1bc6e!2sKuala%20Lumpur%20City%20Centre!5e0!3m2!1sen!2smy!4v1710000000000!5m2!1sen!2smy',
    geo: {
      lat: 3.15248,
      lng: 101.7033,
    },
  },
  tagline: {
    en: 'Your Trusted Financial Partner',
    ms: 'Rakan Kewangan Anda Yang Dipercayai',
  },
  locations: defaultLocations,
};

let cachedSettings: SiteSettings | null = null;

export function useSiteSettings() {
  const contextSettings = useSiteSettingsContext();
  const [settings, setSettings] = useState<SiteSettings>(() => contextSettings || cachedSettings || defaultSettings);
  const [isLoading, setIsLoading] = useState(!contextSettings && !cachedSettings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contextSettings) {
      cachedSettings = contextSettings;
    }
  }, [contextSettings]);

  useEffect(() => {
    if (contextSettings || cachedSettings) return;

    let isMounted = true;

    getSiteSettings()
      .then((response) => {
        if (response.success && response.data && isMounted) {
          cachedSettings = response.data as SiteSettings;
          setSettings(cachedSettings);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load site settings');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [contextSettings]);

  return {
    settings: contextSettings || settings,
    isLoading: contextSettings ? false : isLoading,
    error,
  };
}
