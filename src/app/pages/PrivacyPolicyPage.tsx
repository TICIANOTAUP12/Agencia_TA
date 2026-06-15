import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  AGENCIA_LOCATION,
  AGENCIA_NAME,
  WhatsAppMessages,
  whatsappUrl,
} from "../../lib/whatsapp";
import {
  PRIVACY_POLICY_LAST_UPDATED,
  privacyDataRequestUrl,
  privacyPolicyContent,
} from "../../lib/privacyPolicy";

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";
const POINT_LOGO_SRC = `${import.meta.env.BASE_URL}point-logo.png`;
const AGENCIA_LOGO_SRC = `${import.meta.env.BASE_URL}agencia-logo.png`;

function BrandLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img
        src={POINT_LOGO_SRC}
        alt="Point Once"
        width={32}
        height={32}
        style={{ display: "block", objectFit: "contain", flexShrink: 0, background: "transparent" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          Point Once
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <img
            src={AGENCIA_LOGO_SRC}
            alt={AGENCIA_NAME}
            width={14}
            height={14}
            style={{ display: "block", objectFit: "contain", flexShrink: 0, background: "transparent" }}
          />
          <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: "#1e3a5f", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            by {AGENCIA_NAME}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = `Política de Privacidad | Point Once`;
  }, []);

  return (
    <div style={{ fontFamily: F, background: "#f8fafc", minHeight: "100vh" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "0 20px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <BrandLogo />
          </Link>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: F,
              fontSize: 13,
              fontWeight: 600,
              color: "#64748b",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px 64px" }}>
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>
          Legal
        </p>
        <h1 style={{ fontFamily: FD, fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          Política de Privacidad
        </h1>
        <p style={{ fontFamily: F, fontSize: 13, color: "#64748b", margin: "0 0 40px" }}>
          Última actualización: {PRIVACY_POLICY_LAST_UPDATED}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {privacyPolicyContent.sections.map((section) => (
            <section key={section.title}>
              <h2 style={{ fontFamily: FD, fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  style={{ fontFamily: F, fontSize: 14, lineHeight: 1.7, color: "#475569", margin: "0 0 10px" }}
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul style={{ margin: "8px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 40)}
                      style={{ fontFamily: F, fontSize: 14, lineHeight: 1.7, color: "#475569" }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(15,23,42,0.08)" }}>
          <a
            href={privacyDataRequestUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}
          >
            Solicitar acceso, rectificación o supresión de datos →
          </a>
        </div>
      </main>

      <footer style={{ background: "#0f172a", padding: "36px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <Link
            to="/politica-de-privacidad"
            style={{ fontFamily: F, fontSize: 12, color: "#64748b", textDecoration: "none" }}
          >
            Política de Privacidad
          </Link>
          <p style={{ fontFamily: F, fontSize: 12, color: "#475569", margin: 0 }}>
            © 2025 {AGENCIA_NAME}. Sistema de caja para comercios — {AGENCIA_LOCATION}.
          </p>
          <a
            href={whatsappUrl(WhatsAppMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: F, fontSize: 12, color: "#60a5fa", textDecoration: "none" }}
          >
            Contacto por WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
