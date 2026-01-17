'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

const VISITOR_STORAGE_KEY = 'smc_visitor_id';

const getVisitorId = () => {
  if (typeof window === 'undefined') return undefined;
  let id = window.localStorage.getItem(VISITOR_STORAGE_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
    window.localStorage.setItem(VISITOR_STORAGE_KEY, id);
  }
  return id;
};

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullPath = useMemo(() => {
    const search = searchParams?.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!fullPath) return;

    const visitorId = getVisitorId();
    let referrer = 'direct';
    if (typeof document !== 'undefined' && document.referrer) {
      try {
        referrer = new URL(document.referrer).hostname || 'direct';
      } catch {
        referrer = 'direct';
      }
    }
    const device =
      typeof navigator !== 'undefined'
        ? /mobile/i.test(navigator.userAgent)
          ? 'mobile'
          : /tablet/i.test(navigator.userAgent)
          ? 'tablet'
          : 'desktop'
        : 'desktop';
    const nav =
      typeof navigator !== 'undefined'
        ? (navigator as Navigator & {
            userAgentData?: { brands?: Array<{ brand?: string }> };
          })
        : null;
    const browser = nav?.userAgentData?.brands?.[0]?.brand || nav?.userAgent || 'unknown';

    trackPageView({
      path: fullPath,
      source: referrer || 'direct',
      device,
      browser,
      visitorId,
    });
  }, [fullPath]);

  return null;
}
