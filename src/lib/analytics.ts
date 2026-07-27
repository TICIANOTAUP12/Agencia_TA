/// Google Analytics 4 — gtag y Consent Mode v2 se cargan en index.html; aquí solo eventos custom.
/// Meta Pixel base se carga en index.html; Lead se dispara desde CTAs WhatsApp.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /** Set by index.html when Cookie Script (or any CMP) calls gtag('consent','update',…). */
    __consentLastUpdate?: { ts: number; state: Record<string, string> };
    fbq?: (
      command: string,
      eventNameOrId?: string,
      params?: Record<string, string | number | boolean>,
    ) => void;
  }
}

export function trackEvent(action: string, params?: Record<string, string>): void {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', action, params);
}

export function trackMetaLead(contentName: string): void {
  if (typeof window.fbq !== "function") return;
  window.fbq("track", "Lead", {
    content_name: contentName,
    content_category: "point_once",
  });
}
