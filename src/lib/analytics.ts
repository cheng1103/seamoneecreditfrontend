const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface TrackPageViewPayload {
  path?: string;
  source?: string;
  device?: string;
  browser?: string;
  state?: string;
  visitorId?: string;
}

export async function trackPageView(payload: TrackPageViewPayload) {
  try {
    await fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Fail silently to avoid impacting UX
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics track failed', error);
    }
  }
}

export async function trackEvent(name: string) {
  try {
    await fetch(`${API_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics event failed', error);
    }
  }
}
