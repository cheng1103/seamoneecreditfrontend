'use client';

import { createContext, useContext } from 'react';
import type { SiteSettings } from '@/types/site';

const SiteSettingsContext = createContext<SiteSettings | null>(null);

type ProviderProps = {
  initialSettings: SiteSettings | null;
  children: React.ReactNode;
};

export function SiteSettingsProvider({ initialSettings, children }: ProviderProps) {
  return (
    <SiteSettingsContext.Provider value={initialSettings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettingsContext() {
  return useContext(SiteSettingsContext);
}
