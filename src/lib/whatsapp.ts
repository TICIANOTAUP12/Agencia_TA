export const WHATSAPP_PHONE =
  import.meta.env.VITE_WHATSAPP_PHONE ?? "542646281854";

export const WHATSAPP_DISPLAY =
  import.meta.env.VITE_WHATSAPP_DISPLAY ?? "+54 264 628-1854";

export const AGENCIA_NAME = "Agencia TA";
export const AGENCIA_LOCATION = "San Juan, Argentina";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export const WhatsAppMessages = {
  general:
    "Hola, consulto desde la landing de Point Once. Quisiera recibir más información sobre el sistema de caja y los combos disponibles.",

  header:
    "Hola, consulto desde la web de Point Once. Quisiera recibir asesoramiento sobre el sistema de caja para mi comercio.",

  combo: (name: string, price: string): string =>
    `Hola, me interesa el combo «${name}» (${price}). Quisiera confirmar disponibilidad y los próximos pasos para implementarlo.`,

  comboQuantity: (qty: number, total: string): string =>
    `Hola, me interesan ${qty} Puesto(s) Cymax Completo — total estimado: ${total}. Quisiera confirmar disponibilidad y coordinar la entrega.`,

  license:
    "Hola, ya tengo mi equipo y quisiera consultar el precio de la licencia de Point Once. ¿Podemos conversar sobre las opciones?",

  pricing:
    "Hola, consulto desde la web de Point Once (Agencia TA, San Juan). Quisiera recibir información actualizada sobre precios, combos y opciones de financiación para mi comercio.",

  locales:
    "Hola, me interesa el módulo de Locales de Point Once para administrar varias sucursales o puntos de venta desde un solo sistema. ¿Podemos conversar sobre cómo implementarlo en mi negocio?",

  caucion:
    "Hola, consulto sobre el módulo de Caución en Point Once. Necesito gestionar depósitos y garantías en mi comercio. ¿Me pueden brindar más información y el precio del módulo?",

  excelCentral:
    "Hola, me interesa la funcionalidad de datos generados para Excel Central en Point Once. Quisiera saber cómo exportar reportes y consolidar la información de mis locales desde la administración central.",

  demandaEstado:
    "Hola, consulto sobre la Demanda de Estado en Point Once. Necesito consultar y solicitar el estado de operaciones, pedidos o movimientos entre sucursales. ¿Podemos coordinar una demostración?",

  cta:
    "Hola, quiero implementar Point Once en mi comercio. ¿Podemos coordinar para tenerlo funcionando lo antes posible?",

  stock:
    "Hola, consulto disponibilidad de stock de equipos Point Once. ¿Qué combos tienen listos para entrega?",
} as const;

export type PointOnceFeatureId =
  | "precio"
  | "locales"
  | "caucion"
  | "excelCentral"
  | "demandaEstado";

export function featureMessage(featureId: PointOnceFeatureId): string {
  switch (featureId) {
    case "precio":
      return WhatsAppMessages.pricing;
    case "locales":
      return WhatsAppMessages.locales;
    case "caucion":
      return WhatsAppMessages.caucion;
    case "excelCentral":
      return WhatsAppMessages.excelCentral;
    case "demandaEstado":
      return WhatsAppMessages.demandaEstado;
  }
}
