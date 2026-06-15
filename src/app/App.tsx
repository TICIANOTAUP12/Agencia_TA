import { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import { CheckCircle, TrendingUp, Zap, ShieldCheck, MessageCircle, ArrowRight, Monitor, Scan, Cpu, DollarSign, Package, ChevronDown, Star, Store, FileSpreadsheet, ClipboardList } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import {
  AGENCIA_LOCATION,
  AGENCIA_NAME,
  featureMessage,
  type PointOnceFeatureId,
  WhatsAppMessages,
  whatsappUrl,
} from "../lib/whatsapp";

/* MARKER-MAKE-KIT-INVOKED */

const DEMO_URL = "https://humid-lace-69900289.figma.site";
const POINT_LOGO_SRC = `${import.meta.env.BASE_URL}point-logo.png`;
const AGENCIA_LOGO_SRC = `${import.meta.env.BASE_URL}agencia-logo.png`;
const POINT_HERO_SRC = `${import.meta.env.BASE_URL}point-hero.jpg`;
const POINT_RETAIL_SRC = `${import.meta.env.BASE_URL}point-retail.jpg`;

function openDemo(): void {
  trackEvent("demo_click", { product: "point_once", source: "landing" });
}

function BrandLogo({ iconSize = 36, light = false }: { iconSize?: number; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img
        src={POINT_LOGO_SRC}
        alt="Point Once"
        width={iconSize}
        height={iconSize}
        style={{ display: "block", objectFit: "contain", flexShrink: 0, background: "transparent" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: FD, fontSize: iconSize > 32 ? 26 : 20, fontWeight: 800, color: light ? "#fff" : "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.1 }}>Point Once</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <img
            src={AGENCIA_LOGO_SRC}
            alt={AGENCIA_NAME}
            width={14}
            height={14}
            style={{ display: "block", objectFit: "contain", flexShrink: 0, background: "transparent" }}
          />
          <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: light ? "#60a5fa" : "#1e3a5f", letterSpacing: "0.14em", textTransform: "uppercase" }}>by {AGENCIA_NAME}</span>
        </div>
      </div>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";

// ── Header ──────────────────────────────────────────────────────────────────
function Header() {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled || menuOpen ? "rgba(255,255,255,0.97)" : "#ffffff",
      backdropFilter: "blur(8px)",
      borderBottom: scrolled ? "1px solid rgba(15,23,42,0.08)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <BrandLogo iconSize={isMobile ? 32 : 36} />

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {["#funcionalidades:Funcionalidades", "#combos:Combos", "#garantia:Garantía"].map(item => {
              const [href, label] = item.split(":");
              return (
                <a key={href} href={href} style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none" }}>{label}</a>
              );
            })}
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" onClick={openDemo}
              style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#1d4ed8", background: "#eff6ff", padding: "9px 18px", borderRadius: 9, textDecoration: "none", border: "1.5px solid #bfdbfe" }}>
              Probar demo
            </a>
            <a href={whatsappUrl(WhatsAppMessages.header)} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#fff", background: "#1d4ed8", padding: "9px 20px", borderRadius: 9, textDecoration: "none" }}>
              Consultar ahora
            </a>
          </nav>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display: "block", width: 22, height: 2, background: "#0f172a", borderRadius: 2,
                transition: "all 0.2s",
                transform: menuOpen ? (i === 0 ? "translateY(7px) rotate(45deg)" : i === 2 ? "translateY(-7px) rotate(-45deg)" : "scaleX(0)") : "none",
              }} />
            ))}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div style={{ padding: "16px 20px 24px", borderTop: "1px solid rgba(15,23,42,0.06)", display: "flex", flexDirection: "column", gap: 12 }}>
          {["#funcionalidades:Funcionalidades", "#combos:Combos", "#garantia:Garantía"].map(item => {
            const [href, label] = item.split(":");
            return (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: "#0f172a", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                {label}
              </a>
            );
          })}
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
            onClick={() => { openDemo(); setMenuOpen(false); }}
            style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#1d4ed8", background: "#eff6ff", padding: "14px 20px", borderRadius: 12, textDecoration: "none", textAlign: "center", border: "1.5px solid #bfdbfe" }}>
            Probar demo
          </a>
          <a href={whatsappUrl(WhatsAppMessages.header)} target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#fff", background: "#1d4ed8", padding: "14px 20px", borderRadius: 12, textDecoration: "none", textAlign: "center", marginTop: 4 }}>
            Consultar ahora
          </a>
        </div>
      )}
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #ffffff 0%, #eff6ff 55%, #dbeafe 100%)",
      display: "flex", alignItems: "center", paddingTop: 64,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: isMobile ? "56px 20px" : "80px 24px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 40 : 64,
        alignItems: "center",
      }}>
        {/* Text */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#dbeafe", borderRadius: 100, padding: "6px 16px", marginBottom: 20 }}>
            <Zap size={13} color="#1d4ed8" />
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>Sistema listo para usar hoy mismo</span>
          </div>
          <h1 style={{ fontFamily: FD, fontSize: isMobile ? "clamp(32px,9vw,48px)" : "clamp(38px,4.5vw,58px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-1px" }}>
            Tu comercio facturando en{" "}
            <span style={{ color: "#1d4ed8" }}>24 horas.</span>
            <br />
            Cero errores,{" "}
            <span style={{ color: "#1e3a5f" }}>cero estrés.</span>
          </h1>
          <p style={{ fontFamily: F, fontSize: isMobile ? 16 : 18, color: "#475569", lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
            Point Once es el sistema de caja y control de stock más rápido del mercado. Desarrollado y respaldado por la ingeniería de{" "}
            <strong style={{ color: "#1e3a5f" }}>{AGENCIA_NAME}</strong>.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" onClick={openDemo} style={{
              fontFamily: F, fontSize: 15, fontWeight: 700, color: "#fff", background: "#0f172a",
              padding: "14px 28px", borderRadius: 12, textDecoration: "none",
              boxShadow: "0 4px 24px rgba(15,23,42,0.2)",
            }}>
              Probar demo
            </a>
            <a href="#combos" style={{
              fontFamily: F, fontSize: 15, fontWeight: 700, color: "#fff", background: "#1d4ed8",
              padding: "14px 28px", borderRadius: 12, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 24px rgba(29,78,216,0.35)",
            }}>
              Ver Combos y Precios <ArrowRight size={16} />
            </a>
            <a href="#como-funciona" style={{
              fontFamily: F, fontSize: 15, fontWeight: 600, color: "#1d4ed8",
              padding: "14px 20px", borderRadius: 12, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "2px solid #bfdbfe",
            }}>
              Cómo funciona <ChevronDown size={15} />
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
            <div style={{ display: "flex" }}>
              {["#1d4ed8","#1e3a5f","#2563eb","#1e40af"].map((c, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid white", marginLeft: i > 0 ? -7 : 0 }} />
              ))}
            </div>
            <div>
              <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#facc15" color="#facc15" />)}
              </div>
              <span style={{ fontFamily: F, fontSize: 12, color: "#64748b" }}>+200 comercios activos en Argentina</span>
            </div>
          </div>
        </div>

        {/* Image card */}
        <div style={{ position: "relative" }}>
          <div style={{ background: "#ffffff", borderRadius: 24, padding: isMobile ? 20 : 28, boxShadow: "0 24px 80px rgba(15,23,42,0.12)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "#eff6ff" }} />
            <img
              src={POINT_HERO_SRC}
              alt="Terminales de caja con monitores en mostrador de comercio — foto Unsplash"
              style={{
                width: "100%", aspectRatio: "4/3", borderRadius: 14, position: "relative", zIndex: 1,
                objectFit: "cover", display: "block",
                border: "1px solid rgba(29,78,216,0.12)",
              }}
            />
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#f8fafc", borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CheckCircle size={18} color="#1d4ed8" />
              </div>
              <div>
                <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>Combo Point Full</p>
                <p style={{ fontFamily: F, fontSize: 12, color: "#64748b", margin: 0 }}>Sistema + Hardware + Soporte real</p>
              </div>
            </div>
          </div>
          {!isMobile && (
            <div style={{ position: "absolute", top: -14, right: -14, background: "#1d4ed8", color: "white", borderRadius: 100, padding: "7px 14px", fontFamily: F, fontSize: 11, fontWeight: 700, boxShadow: "0 4px 16px rgba(29,78,216,0.4)" }}>
              ✓ Stock disponible hoy
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Pain points ───────────────────────────────────────────────────────────────
const painPoints = [
  { icon: DollarSign, title: "Caja Exacta", desc: "Control de turnos, ingresos y egresos al centavo para que no falte plata a fin del día.", color: "#1d4ed8", bg: "#eff6ff" },
  { icon: Zap, title: "Actualización al Instante", desc: "Modificá los precios de cientos de productos en 3 clics para ganarle a la inflación.", color: "#059669", bg: "#ecfdf5" },
  { icon: Package, title: "Stock Inteligente", desc: "El sistema te avisa qué comprar antes de que te quedes sin mercadería.", color: "#7c3aed", bg: "#f5f3ff" },
];

function PainPointsSection() {
  const isMobile = useIsMobile();
  return (
    <section id="como-funciona" style={{ background: "#ffffff", padding: isMobile ? "64px 20px" : "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#1d4ed8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
            Los 3 dolores del mostrador
          </span>
          <h2 style={{ fontFamily: FD, fontSize: isMobile ? "clamp(24px,7vw,36px)" : "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.2, margin: 0 }}>
            Los problemas que Point Once{" "}
            <span style={{ color: "#1d4ed8" }}>elimina de raíz</span>
          </h2>
        </div>
        <div style={{ marginBottom: 40, borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 40px rgba(15,23,42,0.08)", border: "1px solid rgba(15,23,42,0.06)" }}>
          <img
            src={POINT_RETAIL_SRC}
            alt="Sistema de punto de venta en comercio — foto Unsplash"
            style={{ width: "100%", height: isMobile ? 200 : 280, objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
          {painPoints.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} style={{ background: "#ffffff", border: "1.5px solid rgba(15,23,42,0.08)", borderRadius: 20, padding: isMobile ? 28 : 36 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={26} color={p.color} />
                </div>
                <h3 style={{ fontFamily: FD, fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontFamily: F, fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Funcionalidades ───────────────────────────────────────────────────────────
const pointFeatures: {
  id: PointOnceFeatureId;
  icon: typeof Store;
  title: string;
  desc: string;
  color: string;
  bg: string;
}[] = [
  {
    id: "precio",
    icon: DollarSign,
    title: "Precios y combos",
    desc: "Consultá precios actualizados de licencias, combos con hardware y opciones de financiación sin sorpresas.",
    color: "#1d4ed8",
    bg: "#eff6ff",
  },
  {
    id: "locales",
    icon: Store,
    title: "Multi Locales",
    desc: "Administrá varias sucursales o puntos de venta desde un solo sistema, con stock y ventas centralizados.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    id: "caucion",
    icon: ShieldCheck,
    title: "Gestión de Caución",
    desc: "Controlá depósitos y garantías de envases retornables o productos con caución, integrado a la caja.",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    id: "excelCentral",
    icon: FileSpreadsheet,
    title: "Datos para Excel Central",
    desc: "Exportá reportes consolidados a Excel desde la administración central de todos tus locales.",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    id: "demandaEstado",
    icon: ClipboardList,
    title: "Demanda de Estado",
    desc: "Consultá y solicitá el estado de pedidos, transferencias y movimientos entre sucursales en tiempo real.",
    color: "#dc2626",
    bg: "#fef2f2",
  },
];

function FeaturesSection() {
  const isMobile = useIsMobile();
  return (
    <section id="funcionalidades" style={{ background: "#f8fafc", padding: isMobile ? "64px 20px" : "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#1d4ed8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
            Módulos del sistema
          </span>
          <h2 style={{ fontFamily: FD, fontSize: isMobile ? "clamp(24px,7vw,36px)" : "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 12px 0" }}>
            Todo lo que Point Once{" "}
            <span style={{ color: "#1d4ed8" }}>puede hacer por vos</span>
          </h2>
          <p style={{ fontFamily: F, fontSize: 15, color: "#64748b", margin: 0 }}>
            Consultá por WhatsApp sobre cualquier módulo. Te responde el equipo de {AGENCIA_NAME}.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {pointFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.id} style={{ background: "#ffffff", border: "1.5px solid rgba(15,23,42,0.08)", borderRadius: 20, padding: isMobile ? 24 : 28, display: "flex", flexDirection: "column" }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: feat.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={24} color={feat.color} />
                </div>
                <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>{feat.title}</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: "#475569", lineHeight: 1.65, margin: "0 0 18px 0", flexGrow: 1 }}>{feat.desc}</p>
                <a href={whatsappUrl(featureMessage(feat.id))} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", borderRadius: 10, fontFamily: F, fontSize: 13, fontWeight: 700, textDecoration: "none", background: "#eff6ff", color: "#1d4ed8", border: "1.5px solid #bfdbfe" }}>
                  <MessageCircle size={14} />
                  Consultar por WhatsApp
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Combos ────────────────────────────────────────────────────────────────────
const puestos = [
  {
    id: "basico",
    name: "Puesto Inicial Básico",
    tagline: "Para arrancar rápido",
    priceEfectivo: "$855.000",
    cuotas: "6 cuotas de $205.200",
    desc: "Solo la computadora. Sin impresora, lector ni gaveta.",
    includes: ["All-In-One Cymax 24\"", "Sistema Point Once local", "Instalación incluida", "Soporte vía WhatsApp"],
    icon: Monitor, highlight: false, badge: null, hasCantidad: false,
  },
  {
    id: "cymax",
    name: "Puesto Cymax Completo",
    tagline: "Un puesto profesional",
    priceEfectivo: "$1.050.000",
    cuotas: "6 cuotas de $252.000",
    desc: "Cymax 24\" + Impresora Waggs + Lector Inalámbrico + Gaveta Electrónica + Sistema Local.",
    includes: ["All-In-One Cymax 24\"", "Impresora Waggs térmica", "Lector inalámbrico", "Gaveta electrónica", "Sistema Point Once local", "Instalación y capacitación"],
    icon: Scan, highlight: true, badge: "Más vendido", hasCantidad: true,
  },
  {
    id: "mini",
    name: "Puesto Mini PC",
    tagline: "Potencia Ryzen 3",
    priceEfectivo: "$1.300.000",
    cuotas: "6 cuotas de $312.000",
    desc: "Mini PC Ryzen 3 + Monitor + Impresora Waggs + Lector Inalámbrico + Gaveta Electrónica.",
    includes: ["Mini PC Ryzen 3", "Monitor independiente", "Impresora Waggs térmica", "Lector inalámbrico", "Gaveta electrónica", "Sistema Point Once local"],
    icon: Cpu, highlight: false, badge: null, hasCantidad: false,
  },
];

const CYMAX_UNIT_EFE = 1050000;
const CYMAX_UNIT_CUO = 252000;

function fmt(n: number) { return "$" + n.toLocaleString("es-AR"); }

function PuestoCard({ combo }: { combo: typeof puestos[0] }) {
  const isMobile = useIsMobile();
  const [qty, setQty] = useState(1);
  const Icon = combo.icon;
  const dispEfe = combo.hasCantidad ? fmt(CYMAX_UNIT_EFE * qty) : combo.priceEfectivo;
  const dispCuo = combo.hasCantidad ? `6 cuotas de ${fmt(CYMAX_UNIT_CUO * qty)}` : combo.cuotas;
  const waMsg = combo.hasCantidad
    ? WhatsAppMessages.comboQuantity(qty, dispEfe)
    : WhatsAppMessages.combo(combo.name, combo.priceEfectivo);

  const hl = combo.highlight;

  return (
    <div style={{
      background: hl ? "#1d4ed8" : "#ffffff",
      border: hl ? "none" : "1.5px solid rgba(15,23,42,0.08)",
      borderRadius: 22, padding: isMobile ? 24 : 30, position: "relative",
      boxShadow: hl ? "0 20px 56px rgba(29,78,216,0.38)" : "none",
      display: "flex", flexDirection: "column",
    }}>
      {combo.badge && (
        <div style={{
          position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
          background: hl ? "#facc15" : "#1d4ed8", color: hl ? "#0f172a" : "#fff",
          borderRadius: 100, padding: "4px 16px", fontFamily: F, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
        }}>{combo.badge}</div>
      )}

      <div style={{ width: 42, height: 42, borderRadius: 12, background: hl ? "rgba(255,255,255,0.15)" : "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon size={20} color={hl ? "#fff" : "#1d4ed8"} />
      </div>

      <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: hl ? "rgba(255,255,255,0.5)" : "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 3px 0" }}>{combo.tagline}</p>
      <h3 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: hl ? "#fff" : "#0f172a", margin: "0 0 14px 0", lineHeight: 1.2 }}>{combo.name}</h3>

      {combo.hasCantidad && (
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Cantidad de puestos:</span>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.25)", overflow: "hidden" }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, background: "none", border: "none", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>−</button>
            <span style={{ fontFamily: FD, fontSize: 17, fontWeight: 800, color: "#fff", minWidth: 28, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, background: "none", border: "none", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>+</button>
          </div>
          {qty >= 2 && <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#86efac", background: "rgba(134,239,172,0.15)", borderRadius: 100, padding: "3px 10px" }}>×{qty} precio especial</span>}
        </div>
      )}

      {/* Precio */}
      <div style={{ marginBottom: 16, padding: "13px 15px", borderRadius: 13, background: hl ? "rgba(255,255,255,0.12)" : "#f8fafc", border: hl ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e2e8f0" }}>
        <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: hl ? "rgba(255,255,255,0.45)" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px 0" }}>Efectivo / Transferencia</p>
        <p style={{ fontFamily: FD, fontSize: 26, fontWeight: 800, color: hl ? "#fff" : "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{dispEfe}</p>
        <div style={{ height: 1, background: hl ? "rgba(255,255,255,0.15)" : "#e2e8f0", margin: "6px 0" }} />
        <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: hl ? "rgba(255,255,255,0.45)" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px 0" }}>Financiado</p>
        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: hl ? "#bfdbfe" : "#1d4ed8", margin: 0 }}>{dispCuo}</p>
      </div>

      <p style={{ fontFamily: F, fontSize: 12, color: hl ? "rgba(255,255,255,0.65)" : "#64748b", margin: "0 0 14px 0", lineHeight: 1.6 }}>{combo.desc}</p>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: 8, flexGrow: 1 }}>
        {combo.includes.map((item, j) => (
          <li key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={14} color={hl ? "#86efac" : "#1d4ed8"} />
            <span style={{ fontFamily: F, fontSize: 13, color: hl ? "rgba(255,255,255,0.88)" : "#374151" }}>{item}</span>
          </li>
        ))}
      </ul>

      <a href={whatsappUrl(waMsg)} target="_blank" rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 0", borderRadius: 11, fontFamily: F, fontSize: 14, fontWeight: 700, textDecoration: "none", background: hl ? "#fff" : "#1d4ed8", color: hl ? "#1d4ed8" : "#fff" }}>
        <MessageCircle size={14} />
        {combo.hasCantidad && qty > 1 ? `Quiero ${qty} puestos` : "Quiero este puesto"}
      </a>
    </div>
  );
}

function SoftwareCard() {
  const isMobile = useIsMobile();
  return (
    <div style={{ background: "#1e3a5f", borderRadius: 22, padding: isMobile ? 28 : 36, boxShadow: "0 12px 48px rgba(30,58,95,0.25)", display: "flex", flexDirection: "column", maxWidth: isMobile ? "100%" : 520, margin: "0 auto" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(96,165,250,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 18, width: "fit-content" }}>
        <Zap size={12} color="#60a5fa" />
        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.08em", textTransform: "uppercase" }}>Solo Software</span>
      </div>
      <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px 0" }}>Ya tenés tu equipo</p>
      <h3 style={{ fontFamily: FD, fontSize: isMobile ? 22 : 26, fontWeight: 800, color: "#fff", margin: "0 0 20px 0" }}>Licencia Point Once</h3>

      <div style={{ marginBottom: 22, padding: "16px 18px", borderRadius: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
        <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Precio único</p>
        <p style={{ fontFamily: FD, fontSize: 34, fontWeight: 800, color: "#60a5fa", margin: "0 0 4px 0", letterSpacing: "-1px" }}>Consultá</p>
        <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>Precio según tu equipo y necesidades</p>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px 0", display: "flex", flexDirection: "column", gap: 11 }}>
        {["Software Point Once completo","Instalación remota o presencial","Actualizaciones incluidas","Conexión nativa con AFIP","Soporte vía WhatsApp","Sin hardware requerido"].map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle size={14} color="#60a5fa" />
            <span style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{item}</span>
          </li>
        ))}
      </ul>

      <div style={{ padding: "13px 15px", borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", marginBottom: 22 }}>
        <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          Ideal si ya tenés una PC en el local y solo necesitás el sistema de caja con soporte real.
        </p>
      </div>

      <a href={whatsappUrl(WhatsAppMessages.license)} target="_blank" rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 11, fontFamily: F, fontSize: 15, fontWeight: 700, textDecoration: "none", background: "#1d4ed8", color: "#fff" }}>
        <MessageCircle size={15} />
        Consultar precio de licencia
      </a>
    </div>
  );
}

function CombosSection() {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<"software" | "hardware">("hardware");

  return (
    <section id="combos" style={{ background: "#f8fafc", padding: isMobile ? "64px 20px" : "96px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#1d4ed8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Oferta Llave en Mano</span>
          <h2 style={{ fontFamily: FD, fontSize: isMobile ? "clamp(24px,7vw,36px)" : "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 12px 0" }}>
            Elegí tu combo y empezá hoy
          </h2>
          <p style={{ fontFamily: F, fontSize: 15, color: "#64748b", margin: "0 0 32px 0" }}>Sin pedido de cotización. Precios claros, decisión rápida.</p>

          {/* Toggle */}
          <div style={{ display: "inline-flex", background: "#e2e8f0", borderRadius: 14, padding: 4, gap: 4, flexWrap: isMobile ? "wrap" : "nowrap", justifyContent: "center" }}>
            {(["software", "hardware"] as const).map(opt => (
              <button key={opt} onClick={() => setMode(opt)} style={{
                fontFamily: F, fontSize: isMobile ? 13 : 15, fontWeight: 700,
                padding: isMobile ? "11px 18px" : "12px 28px",
                borderRadius: 11, border: "none", cursor: "pointer", transition: "all 0.2s",
                background: mode === opt ? "#1d4ed8" : "transparent",
                color: mode === opt ? "#fff" : "#64748b",
                boxShadow: mode === opt ? "0 4px 16px rgba(29,78,216,0.3)" : "none",
                whiteSpace: "nowrap",
              }}>
                {opt === "software" ? "🖥️ Ya tengo mi equipo" : "📦 Quiero hardware incluido"}
              </button>
            ))}
          </div>
        </div>

        {/* Panels */}
        {mode === "software" && <SoftwareCard />}

        {mode === "hardware" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
            {puestos.map(combo => <PuestoCard key={combo.id} combo={combo} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Trust ─────────────────────────────────────────────────────────────────────
function TrustSection() {
  const isMobile = useIsMobile();
  return (
    <section id="garantia" style={{ background: "#1e3a5f", padding: isMobile ? "64px 20px" : "96px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20, marginBottom: 52 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={30} color="#60a5fa" />
          </div>
          <div>
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>El Sello de Garantía</span>
            <h2 style={{ fontFamily: FD, fontSize: isMobile ? "clamp(22px,6vw,34px)" : "clamp(26px,4vw,40px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 20px 0" }}>
              ¿Por qué Point Once nunca te va a dejar tirado?
            </h2>
            <p style={{ fontFamily: F, fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "0 auto", maxWidth: 640 }}>
              A diferencia de otros sistemas que se cuelgan o pierden tus datos, Point Once está construido con la misma infraestructura robusta que usamos en <strong style={{ color: "#60a5fa" }}>{AGENCIA_NAME}</strong> para empresas industriales. Servidores seguros, soporte real y conexión nativa con AFIP.
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {[
            { icon: ShieldCheck, label: "Datos 100% seguros", sub: "Backup automático en la nube" },
            { icon: TrendingUp, label: "Conexión con AFIP", sub: "Factura electrónica integrada" },
            { icon: Zap, label: "Soporte en menos de 2hs", sub: "Técnicos reales, no bots" },
            { icon: CheckCircle, label: "Sin permanencia", sub: "Confiamos en el producto" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: isMobile ? 20 : 26, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(96,165,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon size={26} color="#60a5fa" />
                </div>
                <p style={{ fontFamily: FD, fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 5px 0" }}>{item.label}</p>
                <p style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>{item.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── CTA final ─────────────────────────────────────────────────────────────────
function CtaSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ background: "#f8fafc", padding: isMobile ? "64px 20px" : "96px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: FD, fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(28px,4vw,46px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 16 }}>
          Tu local, listo en{" "}<span style={{ color: "#1d4ed8" }}>24 horas</span>
        </h2>
        <p style={{ fontFamily: F, fontSize: isMobile ? 15 : 17, color: "#64748b", lineHeight: 1.7, marginBottom: 32 }}>
          Matías tiene el stock listo. Escribile hoy y elegí tu combo.
        </p>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
          <a href={whatsappUrl(WhatsAppMessages.cta)} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: F, fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#fff", background: "#1d4ed8", padding: isMobile ? "14px 28px" : "17px 40px", borderRadius: 14, textDecoration: "none", boxShadow: "0 8px 32px rgba(29,78,216,0.35)" }}>
            <MessageCircle size={20} />
            Quiero mi Point Once
          </a>
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" onClick={openDemo}
            style={{ display: "inline-flex", alignItems: "center", fontFamily: F, fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#1d4ed8", background: "#fff", padding: isMobile ? "14px 28px" : "17px 40px", borderRadius: 14, textDecoration: "none", border: "2px solid #bfdbfe" }}>
            Probar demo
          </a>
        </div>
        <p style={{ fontFamily: F, fontSize: 12, color: "#94a3b8", marginTop: 16 }}>Consulta sin compromiso · Respuesta inmediata</p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: "#0f172a", padding: "36px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row", gap: 16 }}>
        <BrandLogo iconSize={32} light />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: isMobile ? "flex-start" : "flex-end" }}>
          <Link
            to="/politica-de-privacidad"
            style={{ fontFamily: F, fontSize: 12, color: "#64748b", textDecoration: "none" }}
          >
            Política de Privacidad
          </Link>
          <p style={{ fontFamily: F, fontSize: 12, color: "#475569", margin: 0 }}>
            © 2025 {AGENCIA_NAME}. Sistema de caja para comercios — {AGENCIA_LOCATION}.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── WhatsApp flotante ─────────────────────────────────────────────────────────
function WhatsAppButton() {
  const isMobile = useIsMobile();
  return (
    <a href={whatsappUrl(WhatsAppMessages.stock)} target="_blank" rel="noopener noreferrer"
      style={{
        position: "fixed", bottom: isMobile ? 16 : 24, right: isMobile ? 16 : 24, zIndex: 100,
        display: "flex", alignItems: "center", gap: isMobile ? 0 : 10,
        background: "#25d366", color: "#fff",
        padding: isMobile ? "14px" : "13px 20px",
        borderRadius: 100, textDecoration: "none",
        fontFamily: F, fontSize: 13, fontWeight: 700,
        boxShadow: "0 8px 32px rgba(37,211,102,0.45)",
        animation: "wa-pulse 3s ease-in-out infinite",
      }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {!isMobile && "Consultar stock"}
    </a>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function PointOnceLanding() {
  return (
    <div style={{ fontFamily: F }}>
      <style>{`
        @keyframes wa-pulse {
          0%,100% { box-shadow: 0 8px 32px rgba(37,211,102,0.45); }
          50% { box-shadow: 0 8px 48px rgba(37,211,102,0.7), 0 0 0 8px rgba(37,211,102,0.1); }
        }
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; }
      `}</style>
      <Header />
      <HeroSection />
      <PainPointsSection />
      <FeaturesSection />
      <CombosSection />
      <TrustSection />
      <CtaSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<PointOnceLanding />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
