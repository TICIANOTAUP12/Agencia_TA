const SITE_ORIGIN = "https://sistemataup.online";

export type SeoKeywordGroups = {
  primary: readonly string[];
  secondary: readonly string[];
  local: readonly string[];
};

export type SeoConfig = {
  channel: "point-once";
  siteName: string;
  author: string;
  title: string;
  description: string;
  keywords: SeoKeywordGroups;
  canonicalUrl: string;
  robots: string;
  locale: string;
  favicon: string;
  appleTouchIcon: string;
  og: {
    type: string;
    title: string;
    description: string;
    url: string;
    image: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  jsonLd: Record<string, unknown>;
};

export const seoKeywords: SeoKeywordGroups = {
  primary: [
    "sistema de caja",
    "punto de venta",
    "POS",
    "software POS Argentina",
    "caja para kioscos",
    "software de kiosco",
    "sistema de caja supermercado",
    "POS kiosco",
    "POS supermercado",
  ],
  secondary: [
    "facturación electrónica AFIP",
    "control de stock",
    "multi locales",
    "gestión de caución",
    "caja registradora comercio",
    "caja registradora retail",
    "caja registradora almacén",
    "despensa",
    "Point Once",
    "Cymax",
    "Agencia TA",
  ],
  local: [
    "comercios San Juan",
    "punto de venta San Juan",
    "kioscos San Juan",
    "supermercados San Juan",
    "retail Argentina",
    "sistema de caja Argentina",
  ],
};

export const seoConfig: SeoConfig = {
  channel: "point-once",
  siteName: "Point Once by Agencia TA",
  author: "Agencia TA",
  title: "Point Once | Sistema de Caja para Kioscos, Supermercados y Comercios | Agencia TA",
  description:
    "Software de caja y POS para kioscos, supermercados, almacenes y despensas. Control de stock, facturación AFIP, multi locales, gestión de caución, equipos Cymax e instalación con soporte en San Juan, Argentina.",
  keywords: seoKeywords,
  canonicalUrl: `${SITE_ORIGIN}/point/`,
  robots: "index, follow",
  locale: "es_AR",
  favicon: "point-logo.png",
  appleTouchIcon: "point-logo.png",
  og: {
    type: "website",
    title: "Point Once | Sistema de Caja para Kioscos, Supermercados y Comercios",
    description:
      "Caja registradora y punto de venta para kioscos y supermercados. Combos hardware + software, facturación AFIP, multi locales, gestión de caución y soporte Agencia TA en San Juan, Argentina.",
    url: `${SITE_ORIGIN}/point/`,
    image: `${SITE_ORIGIN}/point/point-logo.png`,
  },
  twitter: {
    card: "summary",
    title: "Point Once | Caja y POS para Kioscos y Supermercados",
    description:
      "Sistema de caja para kioscos, supermercados y retail. Stock, facturación AFIP, multi locales, caución, hardware Cymax e instalación con soporte local.",
    image: `${SITE_ORIGIN}/point/point-logo.png`,
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Point Once",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows",
    description:
      "Software de caja y POS para kioscos, supermercados, almacenes y despensas en Argentina. Control de stock, facturación AFIP, multi locales, gestión de caución, equipos Cymax e instalación con soporte de Agencia TA en San Juan.",
    url: `${SITE_ORIGIN}/point/`,
    keywords:
      "sistema de caja, punto de venta, POS, facturación AFIP, control de stock, multi locales, gestión de caución, Cymax, comercios San Juan, retail Argentina",
    provider: {
      "@type": "Organization",
      name: "Agencia TA",
      url: `${SITE_ORIGIN}/`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Juan",
        addressRegion: "San Juan",
        addressCountry: "AR",
      },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
    },
  },
};

export function keywordsToMetaContent(keywords: SeoKeywordGroups = seoKeywords): string {
  return [...keywords.primary, ...keywords.secondary, ...keywords.local].join(", ");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderSeoHeadHtml(config: SeoConfig = seoConfig): string {
  const keywords = keywordsToMetaContent(config.keywords);
  const jsonLd = JSON.stringify(config.jsonLd, null, 2);

  return [
    `<title>${escapeHtml(config.title)}</title>`,
    `<meta name="description" content="${escapeHtml(config.description)}" />`,
    `<meta name="keywords" content="${escapeHtml(keywords)}" />`,
    `<meta name="author" content="${escapeHtml(config.author)}" />`,
    `<meta name="robots" content="${escapeHtml(config.robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(config.canonicalUrl)}" />`,
    "",
    `<meta property="og:type" content="${escapeHtml(config.og.type)}" />`,
    `<meta property="og:locale" content="${escapeHtml(config.locale)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(config.siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(config.og.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(config.og.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(config.og.url)}" />`,
    `<meta property="og:image" content="${escapeHtml(config.og.image)}" />`,
    "",
    `<meta name="twitter:card" content="${escapeHtml(config.twitter.card)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(config.twitter.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(config.twitter.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(config.twitter.image)}" />`,
    "",
    `<link rel="icon" type="image/png" href="${escapeHtml(config.favicon)}" />`,
    `<link rel="apple-touch-icon" href="${escapeHtml(config.appleTouchIcon)}" />`,
    "",
    `<script type="application/ld+json">`,
    jsonLd,
    `</script>`,
  ].join("\n      ");
}
