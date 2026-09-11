import { Link, useLocation } from "react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import { whatsappUrl } from "../../lib/whatsapp";
import { PointOnceChatWidget } from "../components/PointOnceChatWidget";
import { useEffect } from "react";

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";

type GraciasState = {
  id?: number;
  nombre?: string;
  comercio?: string;
};

export function DiagnosticoGraciasPage() {
  const location = useLocation();
  const state = (location.state as GraciasState | null) ?? {};
  const savedId = state.id;
  const nombre = state.nombre?.trim() || "cliente";
  const comercio = state.comercio?.trim() || "tu comercio";

  useEffect(() => {
    trackEvent("diagnostico_gracias_view", {
      product: "point_once",
      source: "diagnostico",
      ...(savedId != null ? { id: String(savedId) } : {}),
    });
  }, [savedId]);

  const assistMessage =
    `Hola, completé el diagnóstico rápido de Point Sales (#${savedId ?? ""}). ` +
    `Comercio: ${comercio}. Quiero el asistente gratuito para mejorar la gestión.`;

  return (
    <div style={{ fontFamily: F, minHeight: "100vh", background: "linear-gradient(165deg,#fff 0%,#eff6ff 55%,#dbeafe 100%)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div className="po-card po-card--elevated" style={{ borderRadius: 24, padding: "40px 28px", textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#ecfdf5",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <CheckCircle2 size={32} color="#059669" />
          </div>
          <h1 style={{ fontFamily: FD, fontSize: "clamp(26px,6vw,36px)", fontWeight: 800, color: "#0f172a", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Diagnóstico guardado
          </h1>
          <p style={{ fontFamily: F, fontSize: 16, color: "#475569", lineHeight: 1.7, margin: "0 0 28px" }}>
            Gracias, {nombre}. Ya tenemos el perfil de <strong>{comercio}</strong>.
            Accedé al asistente gratuito pensado para comercios retail: precios, márgenes, costos, stock y decisiones.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <a
              href={whatsappUrl(assistMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("diagnostico_asistente_wa", { product: "point_once" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: F,
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                background: "#1d4ed8",
                padding: "14px 26px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 8px 28px rgba(29,78,216,0.35)",
              }}
            >
              <MessageCircle size={18} />
              Abrir asistente por WhatsApp
            </a>
            <Link
              to="/"
              style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: "#1d4ed8", textDecoration: "none" }}
            >
              Volver a Point Sales
            </Link>
          </div>
        </div>
      </div>
      <PointOnceChatWidget />
    </div>
  );
}
