/// Google Analytics 4 — gtag y Consent Mode v2 se cargan en index.html; aquí solo eventos custom.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /** Set by index.html when Cookie Script (or any CMP) calls gtag('consent','update',…). */
    __consentLastUpdate?: { ts: number; state: Record<string, string> };
  }
}

export function trackEvent(action: string, params?: Record<string, string>): void {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', action, params);
}
