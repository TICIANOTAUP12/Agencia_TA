import { MessageCircle } from "lucide-react";
import { WhatsAppMessages } from "../../lib/whatsapp";
import { VideoPromoStage } from "../components/VideoPromoStage";
import { WhatsAppLinkButton } from "../components/WhatsAppLinkButton";

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";
const AGENCIA_LOGO = `${import.meta.env.BASE_URL}agencia-logo.png`;

export function PromoErpCopy() {
  return (
    <div style={{ maxWidth: 720 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <img
          src={AGENCIA_LOGO}
          alt="Agencia TA"
          style={{ height: 36, width: "auto", display: "block" }}
        />
        <span
          style={{
            fontFamily: F,
            fontSize: 12,
            fontWeight: 700,
            color: "#5eead4",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          TAUP Gestión
        </span>
      </div>
      <h1
        style={{
          fontFamily: FD,
          fontSize: "clamp(32px, 7vw, 56px)",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-1px",
          lineHeight: 1.08,
          margin: "0 0 16px 0",
        }}
      >
        Hacemos ERP personalizado.
      </h1>
      <p
        style={{
          fontFamily: F,
          fontSize: "clamp(18px, 2.6vw, 24px)",
          fontWeight: 700,
          color: "#5eead4",
          margin: "0 0 14px 0",
        }}
      >
        No te lo pierdas.
      </p>
      <p
        style={{
          fontFamily: F,
          fontSize: "clamp(15px, 2.2vw, 18px)",
          color: "rgba(255,255,255,0.86)",
          lineHeight: 1.6,
          margin: "0 0 28px 0",
          maxWidth: 540,
        }}
      >
        Ventas, compras, pagos y stock — armado a cómo trabaja tu empresa.
        No es un paquete genérico. Demo de 15 minutos por WhatsApp.
      </p>
      <WhatsAppLinkButton
        fallbackMessage={WhatsAppMessages.erpDemo}
        trackLabel="promo_erp"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontFamily: F,
          fontSize: 16,
          fontWeight: 700,
          color: "#042f2e",
          background: "#2dd4bf",
          padding: "14px 26px",
          borderRadius: 12,
          textDecoration: "none",
        }}
      >
        <MessageCircle size={18} />
        Pedí una demo de 15 minutos
      </WhatsAppLinkButton>
    </div>
  );
}

export function PromoErpSection() {
  return (
    <VideoPromoStage
      id="erp"
      shade="linear-gradient(165deg, #0b1f33 0%, #0e4a5c 48%, #0c6b5c 100%)"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <PromoErpCopy />
      </div>
    </VideoPromoStage>
  );
}

export function PromoErpPage() {
  return (
    <div style={{ background: "#0b1f33", minHeight: "100vh" }}>
      <PromoErpSection />
    </div>
  );
}
