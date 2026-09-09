const DIAGNOSTICO_API_BASE = (
  import.meta.env.VITE_DIAGNOSTICO_API_URL ?? "/api/diagnostico-api"
).replace(/\/$/, "");

export interface DiagnosticoPayload {
  registro_ventas: string;
  usa_sistema: string;
  facilita_trabajo: string;
  cuestan_control: string[];
  margen_producto: string;
  mejorar_hoy: string;
  nombre: string;
  comercio: string;
  whatsapp: string;
}

export interface DiagnosticoResponse {
  id: number;
  ok: boolean;
}

export async function submitDiagnostico(
  payload: DiagnosticoPayload,
): Promise<DiagnosticoResponse> {
  const response = await fetch(`${DIAGNOSTICO_API_BASE}/diagnostico`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: unknown };
      if (typeof data.detail === "string") {
        detail = data.detail;
      }
    } catch {
      // keep status text
    }
    throw new Error(detail);
  }

  return (await response.json()) as DiagnosticoResponse;
}
