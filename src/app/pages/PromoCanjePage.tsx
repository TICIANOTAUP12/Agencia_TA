import { ArrowLeft, MessageCircle, RefreshCcw } from "lucide-react";
import { Link } from "react-router";
import { WhatsAppMessages } from "../../lib/whatsapp";
import { VideoPromoStage } from "../components/VideoPromoStage";
import { WhatsAppLinkButton } from "../components/WhatsAppLinkButton";

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";
const POSTER = `${import.meta.env.BASE_URL}point-retail.jpg`;

export function PromoCanjeCopy() {
  return (
    <div style={{ maxWidth: 720 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(250, 204, 21, 0.18)",
          border: "1px solid rgba(250, 204, 21, 0.45)",
          borderRadius: 100,
          padding: "6px 14px",
          marginBottom: 18,
        }}
      >
        <RefreshCcw size={13} color="#facc15" />
        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#facc15", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Promo canje · Point Sales
        </span>
      </div>
      <h1
        style={{
          fontFamily: FD,
          fontSize: "clamp(32px, 7vw, 58px)",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-1px",
          lineHeight: 1.08,
          margin: "0 0 16px 0",
        }}
      >
        Tu equipamiento lo tomamos como parte de pago.
      </h1>
      <p
        style={{
          fontFamily: F,
          fontSize: "clamp(16px, 2.4vw, 20px)",
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.55,
          margin: "0 0 22px 0",
          maxWidth: 560,
        }}
      >
        Te lo reemplazamos por equipo <strong style={{ color: "#fff" }}>reacondicionado o nuevo</strong>
        {" "}y un sistema. Instalación en tu local. A lo sumo 15 días.
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 28px 0",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          "Parte de pago: tu PC / caja actual",
          "Salida: reacondicionado o nuevo + sistema Point",
          "Puesta en marcha en el local · Cuyo",
        ].map((line) => (
          <li key={line} style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.78)" }}>
            {line}
          </li>
        ))}
      </ul>
      <WhatsAppLinkButton
        fallbackMessage={WhatsAppMessages.tradeIn}
        trackLabel="promo_canje"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontFamily: F,
          fontSize: 16,
          fontWeight: 700,
          color: "#0f172a",
          background: "#facc15",
          padding: "14px 26px",
          borderRadius: 12,
          textDecoration: "none",
        }}
      >
        <MessageCircle size={18} />
        Quiero canjear mi equipo
      </WhatsAppLinkButton>
    </div>
  );
}

export function PromoCanjeSection() {
  return (
    <VideoPromoStage
      id="canje"
      posterSrc={POSTER}
      shade="linear-gradient(160deg, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.55) 45%, rgba(30,58,95,0.72) 100%)"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <PromoCanjeCopy />
      </div>
    </VideoPromoStage>
  );
}

export function PromoCanjePage() {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 20,
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: F,
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ArrowLeft size={15} />
          Point Sales
        </Link>
      </div>
      <PromoCanjeSection />
    </div>
  );
}
