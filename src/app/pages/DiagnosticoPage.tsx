import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Store,
} from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import { submitDiagnostico } from "../../lib/diagnosticoApi";
import { AGENCIA_NAME, WhatsAppMessages, whatsappUrl } from "../../lib/whatsapp";
import { PointOnceChatWidget } from "../components/PointOnceChatWidget";

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";
const POINT_LOGO = `${import.meta.env.BASE_URL}logo-point-isotipo.svg`;

const REGISTRO_VENTAS = [
  "Sistema de punto de venta",
  "Excel / Google Sheets",
  "Cuaderno / papel",
  "Caja registradora",
  "No llevo un registro detallado",
] as const;

const USA_SISTEMA = ["Sí", "No", "Uso varias herramientas separadas"] as const;

const FACILITA = [
  "Sí, mucho",
  "Cumple lo básico",
  "Poco",
  "Me genera más trabajo",
  "No uso sistema",
] as const;

const CONTROL = [
  "Ventas",
  "Stock",
  "Caja",
  "Gastos",
  "Rentabilidad",
  "Productos y precios",
  "Empleados",
  "Todo está bastante controlado",
] as const;

const MARGEN = ["Sí", "Aproximadamente", "No", "Nunca lo calculé"] as const;

type StepId =
  | "registro"
  | "sistema"
  | "facilita"
  | "control"
  | "margen"
  | "mejorar"
  | "datos";

const STEPS: { id: StepId; title: string }[] = [
  { id: "registro", title: "Registro de ventas" },
  { id: "sistema", title: "Sistema actual" },
  { id: "facilita", title: "Facilidad" },
  { id: "control", title: "Control" },
  { id: "margen", title: "Márgenes" },
  { id: "mejorar", title: "Prioridad" },
  { id: "datos", title: "Tus datos" },
];

interface FormState {
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

const EMPTY: FormState = {
  registro_ventas: "",
  usa_sistema: "",
  facilita_trabajo: "",
  cuestan_control: [],
  margen_producto: "",
  mejorar_hoy: "",
  nombre: "",
  comercio: "",
  whatsapp: "",
};

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: F,
        fontSize: 15,
        fontWeight: selected ? 700 : 500,
        textAlign: "left",
        color: selected ? "#1d4ed8" : "#0f172a",
        background: selected ? "#eff6ff" : "#fff",
        border: selected ? "2px solid #1d4ed8" : "1.5px solid #cbd5e1",
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: selected ? "6px solid #1d4ed8" : "2px solid #94a3b8",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      />
      {label}
    </button>
  );
}

function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: F,
        fontSize: 14,
        fontWeight: selected ? 700 : 500,
        color: selected ? "#fff" : "#334155",
        background: selected ? "#1d4ed8" : "#fff",
        border: selected ? "1.5px solid #1d4ed8" : "1.5px solid #cbd5e1",
        borderRadius: 12,
        padding: "11px 14px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

const fieldStyle: CSSProperties = {
  fontFamily: F,
  fontSize: 15,
  color: "#0f172a",
  background: "#fff",
  border: "1.5px solid #cbd5e1",
  borderRadius: 12,
  padding: "12px 14px",
  width: "100%",
  outline: "none",
};

export function DiagnosticoPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function canAdvance(): boolean {
    switch (step.id) {
      case "registro":
        return Boolean(form.registro_ventas);
      case "sistema":
        return Boolean(form.usa_sistema);
      case "facilita":
        return Boolean(form.facilita_trabajo);
      case "control":
        return form.cuestan_control.length > 0;
      case "margen":
        return Boolean(form.margen_producto);
      case "mejorar":
        return form.mejorar_hoy.trim().length >= 3;
      case "datos":
        return (
          form.nombre.trim().length >= 2 &&
          form.comercio.trim().length >= 2 &&
          form.whatsapp.replace(/\D/g, "").length >= 8
        );
      default:
        return false;
    }
  }

  function toggleControl(option: string): void {
    setForm((prev) => {
      const exists = prev.cuestan_control.includes(option);
      if (option === "Todo está bastante controlado") {
        return {
          ...prev,
          cuestan_control: exists ? [] : [option],
        };
      }
      const withoutTodo = prev.cuestan_control.filter(
        (item) => item !== "Todo está bastante controlado",
      );
      return {
        ...prev,
        cuestan_control: exists
          ? withoutTodo.filter((item) => item !== option)
          : [...withoutTodo, option],
      };
    });
  }

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (!canAdvance() || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    trackEvent("diagnostico_submit", { product: "point_once", source: "diagnostico" });
    try {
      const result = await submitDiagnostico({
        registro_ventas: form.registro_ventas,
        usa_sistema: form.usa_sistema,
        facilita_trabajo: form.facilita_trabajo,
        cuestan_control: form.cuestan_control,
        margen_producto: form.margen_producto,
        mejorar_hoy: form.mejorar_hoy.trim(),
        nombre: form.nombre.trim(),
        comercio: form.comercio.trim(),
        whatsapp: form.whatsapp.trim(),
      });
      setSavedId(result.id);
      trackEvent("diagnostico_saved", {
        product: "point_once",
        source: "diagnostico",
        id: result.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setIsSubmitting(false);
    }
  }

  const assistMessage =
    `Hola, completé el diagnóstico rápido de Point Sales (#${savedId ?? ""}). ` +
    `Comercio: ${form.comercio}. Quiero el asistente gratuito para mejorar la gestión.`;

  if (savedId !== null) {
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
              Gracias, {form.nombre}. Ya tenemos el perfil de <strong>{form.comercio}</strong>.
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

  return (
    <div style={{ fontFamily: F, minHeight: "100vh", background: "linear-gradient(165deg,#ffffff 0%,#f8fafc 40%,#eff6ff 100%)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: F,
              fontSize: 13,
              fontWeight: 600,
              color: "#475569",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            Point Sales
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={POINT_LOGO} alt="Point Sales" width={28} height={28} />
            <span style={{ fontFamily: FD, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              Diagnóstico
            </span>
          </div>
        </div>
        <div style={{ height: 4, background: "#e2e8f0" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#1d4ed8",
              transition: "width 0.25s ease",
            }}
          />
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px 96px" }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#dbeafe",
              borderRadius: 100,
              padding: "6px 14px",
              marginBottom: 14,
            }}
          >
            <ClipboardList size={14} color="#1d4ed8" />
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
              Paso {stepIndex + 1} de {STEPS.length} · {step.title}
            </span>
          </div>
          <h1
            style={{
              fontFamily: FD,
              fontSize: "clamp(28px,6vw,40px)",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.8px",
              lineHeight: 1.15,
              margin: "0 0 12px",
            }}
          >
            Diagnóstico rápido para comercios
          </h1>
          <p style={{ fontFamily: F, fontSize: 16, color: "#64748b", lineHeight: 1.65, margin: 0, maxWidth: 560 }}>
            Respondé estas preguntas y accedé al asistente gratuito de {AGENCIA_NAME} para mejorar la gestión de tu comercio.
          </p>
        </div>

        <form onSubmit={onSubmit} className="po-card po-card--elevated" style={{ borderRadius: 22, padding: "28px 22px" }}>
          {step.id === "registro" && (
            <QuestionBlock title="1. ¿Cómo registrás actualmente tus ventas?">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {REGISTRO_VENTAS.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={form.registro_ventas === option}
                    onClick={() => setForm((prev) => ({ ...prev, registro_ventas: option }))}
                  />
                ))}
              </div>
            </QuestionBlock>
          )}

          {step.id === "sistema" && (
            <QuestionBlock title="2. ¿Usás actualmente algún sistema para administrar tu comercio?">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {USA_SISTEMA.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={form.usa_sistema === option}
                    onClick={() => setForm((prev) => ({ ...prev, usa_sistema: option }))}
                  />
                ))}
              </div>
            </QuestionBlock>
          )}

          {step.id === "facilita" && (
            <QuestionBlock title="3. Si usás un sistema, ¿sentís que realmente te facilita el trabajo?">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FACILITA.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={form.facilita_trabajo === option}
                    onClick={() => setForm((prev) => ({ ...prev, facilita_trabajo: option }))}
                  />
                ))}
              </div>
            </QuestionBlock>
          )}

          {step.id === "control" && (
            <QuestionBlock
              title="4. ¿Qué es lo que más te cuesta controlar hoy?"
              hint="Podés elegir más de una."
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {CONTROL.map((option) => (
                  <ChipButton
                    key={option}
                    label={option}
                    selected={form.cuestan_control.includes(option)}
                    onClick={() => toggleControl(option)}
                  />
                ))}
              </div>
            </QuestionBlock>
          )}

          {step.id === "margen" && (
            <QuestionBlock title="5. ¿Sabés con precisión cuánto ganás por cada producto?">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MARGEN.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={form.margen_producto === option}
                    onClick={() => setForm((prev) => ({ ...prev, margen_producto: option }))}
                  />
                ))}
              </div>
            </QuestionBlock>
          )}

          {step.id === "mejorar" && (
            <QuestionBlock title="6. Si pudieras mejorar una sola cosa de tu comercio hoy, ¿cuál sería?">
              <textarea
                value={form.mejorar_hoy}
                onChange={(e) => setForm((prev) => ({ ...prev, mejorar_hoy: e.target.value }))}
                rows={5}
                placeholder="Ej: controlar el stock sin perder ventas, saber si gano o pierdo por producto…"
                style={{ ...fieldStyle, resize: "vertical", minHeight: 120 }}
              />
            </QuestionBlock>
          )}

          {step.id === "datos" && (
            <QuestionBlock title="Tus datos" hint="Con esto te abrimos el asistente gratuito.">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#334155" }}>Nombre</span>
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                    autoComplete="name"
                    style={fieldStyle}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#334155" }}>
                    Nombre del comercio
                  </span>
                  <div style={{ position: "relative" }}>
                    <Store
                      size={16}
                      color="#94a3b8"
                      style={{ position: "absolute", left: 14, top: 15, pointerEvents: "none" }}
                    />
                    <input
                      value={form.comercio}
                      onChange={(e) => setForm((prev) => ({ ...prev, comercio: e.target.value }))}
                      autoComplete="organization"
                      style={{ ...fieldStyle, paddingLeft: 40 }}
                    />
                  </div>
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#334155" }}>WhatsApp</span>
                  <input
                    value={form.whatsapp}
                    onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Ej: 264 XXX XXXX"
                    style={fieldStyle}
                  />
                </label>
                <p style={{ fontFamily: F, fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Al completar el diagnóstico accedés gratis a un asistente de IA pensado para comercios retail
                  (precios, márgenes, costos, stock y decisiones del negocio).
                </p>
              </div>
            </QuestionBlock>
          )}

          {error && (
            <p style={{ fontFamily: F, fontSize: 14, color: "#dc2626", margin: "16px 0 0" }} role="alert">
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              style={{
                fontFamily: F,
                fontSize: 14,
                fontWeight: 700,
                color: stepIndex === 0 ? "#94a3b8" : "#475569",
                background: "#fff",
                border: "1.5px solid #cbd5e1",
                borderRadius: 11,
                padding: "12px 18px",
                cursor: stepIndex === 0 ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ArrowLeft size={16} />
              Atrás
            </button>

            {step.id !== "datos" ? (
              <button
                type="button"
                disabled={!canAdvance()}
                onClick={() => {
                  if (!canAdvance()) return;
                  setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
                }}
                style={{
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  background: canAdvance() ? "#1d4ed8" : "#94a3b8",
                  border: "none",
                  borderRadius: 11,
                  padding: "12px 20px",
                  cursor: canAdvance() ? "pointer" : "not-allowed",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginLeft: "auto",
                }}
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canAdvance() || isSubmitting}
                style={{
                  fontFamily: F,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  background: canAdvance() && !isSubmitting ? "#1d4ed8" : "#94a3b8",
                  border: "none",
                  borderRadius: 11,
                  padding: "12px 20px",
                  cursor: canAdvance() && !isSubmitting ? "pointer" : "not-allowed",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginLeft: "auto",
                  boxShadow: canAdvance() ? "0 6px 20px rgba(29,78,216,0.3)" : "none",
                }}
              >
                {isSubmitting ? "Guardando…" : "Completar y acceder"}
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </form>

        <p style={{ fontFamily: F, fontSize: 12, color: "#94a3b8", marginTop: 20, textAlign: "center" }}>
          Preferís hablar ahora?{" "}
          <a
            href={whatsappUrl(WhatsAppMessages.header)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1d4ed8", fontWeight: 600 }}
          >
            Escribinos por WhatsApp
          </a>
        </p>
      </main>
    </div>
  );
}

function QuestionBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2
        style={{
          fontFamily: FD,
          fontSize: "clamp(18px,3.5vw,22px)",
          fontWeight: 800,
          color: "#0f172a",
          margin: "0 0 8px",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      {hint && (
        <p style={{ fontFamily: F, fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>{hint}</p>
      )}
      {!hint && <div style={{ height: 12 }} />}
      {children}
    </div>
  );
}

export default DiagnosticoPage;
