import { featureMessage, type PointOnceFeatureId, whatsappUrl } from "./whatsapp";

const CORE_API_BASE = (
  import.meta.env.VITE_CORE_API_URL ?? "/api/core"
).replace(/\/$/, "");

export interface CoreChatResponse {
  reply: string;
  whatsapp_url: string;
  intents: { type: string; confidence: number; args: Record<string, unknown> }[];
  state: string;
  needs_human: boolean;
}

export const FEATURE_INTENT: Record<PointOnceFeatureId, string> = {
  precio: "consulta_precio",
  locales: "modulo_locales",
  caucion: "modulo_caucion",
  excelCentral: "modulo_excel_central",
  demandaEstado: "modulo_demanda_estado",
};

export function comboInquiryText(comboId: string, quantity: number): string {
  if (comboId === "cymax") {
    return quantity > 1
      ? `quiero ${quantity} cymax`
      : "quiero el puesto cymax completo";
  }
  if (comboId === "basico") {
    return "quiero el puesto basico";
  }
  if (comboId === "mini") {
    return "quiero el mini pc";
  }
  return "me interesa un combo de Point Once";
}

export async function fetchWhatsAppUrl(params: {
  intent?: string;
  text?: string;
  fallbackMessage: string;
}): Promise<string> {
  const body: { intent?: string; text?: string } = {};
  if (params.text?.trim()) {
    body.text = params.text.trim();
  } else if (params.intent) {
    body.intent = params.intent;
  } else {
    return whatsappUrl(params.fallbackMessage);
  }

  try {
    const response = await fetch(`${CORE_API_BASE}/link/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`core HTTP ${response.status}`);
    }

    const data = (await response.json()) as CoreChatResponse;
    if (data.whatsapp_url?.startsWith("https://wa.me/")) {
      return data.whatsapp_url;
    }

    throw new Error("core response missing whatsapp_url");
  } catch {
    if (params.intent) {
      const featureId = (
        Object.entries(FEATURE_INTENT) as [PointOnceFeatureId, string][]
      ).find(([, intent]) => intent === params.intent)?.[0];
      if (featureId) {
        return whatsappUrl(featureMessage(featureId));
      }
    }
    return whatsappUrl(params.fallbackMessage);
  }
}

export async function checkCoreHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${CORE_API_BASE}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return false;
    }
    const data = (await response.json()) as { status?: string };
    return data.status === "ok";
  } catch {
    return false;
  }
}

const SESSION_PHONE_KEY = "po_chat_phone";

export function getChatSessionPhone(): string {
  if (typeof window === "undefined") {
    return "5492600000000";
  }
  const stored = sessionStorage.getItem(SESSION_PHONE_KEY);
  if (stored) {
    return stored;
  }
  const suffix = Math.floor(1_000_000 + Math.random() * 9_000_000);
  const phone = `54926${suffix}`;
  sessionStorage.setItem(SESSION_PHONE_KEY, phone);
  return phone;
}

export async function sendChatMessage(
  phone: string,
  text: string,
): Promise<CoreChatResponse> {
  const response = await fetch(`${CORE_API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, text }),
  });

  if (!response.ok) {
    throw new Error(`core HTTP ${response.status}`);
  }

  const data = (await response.json()) as CoreChatResponse;
  if (!data.reply?.trim()) {
    throw new Error("core response missing reply");
  }
  return data;
}

export function shouldShowWhatsAppHandoff(response: CoreChatResponse): boolean {
  return (
    response.needs_human ||
    response.state === "confirming" ||
    response.state === "handoff"
  );
}
