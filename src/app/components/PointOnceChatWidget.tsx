import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import {
  getChatSessionPhone,
  sendChatMessage,
  shouldShowWhatsAppHandoff,
  type CoreChatResponse,
} from "../../lib/coreApi";
import { AGENCIA_NAME, WhatsAppMessages, whatsappUrl } from "../../lib/whatsapp";

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

const QUICK_PROMPTS: { label: string; text: string }[] = [
  { label: "Ver precios", text: "cuánto cuestan los combos" },
  { label: "Stock hoy", text: "tienen stock?" },
  { label: "2 Cymax", text: "quiero 2 cymax" },
  { label: "Licencia", text: "precio de la licencia" },
  { label: "Asesor", text: "quiero hablar con un asesor" },
];

const WELCOME_MESSAGE =
  "¡Hola! Soy el asistente de Point Once. Te ayudo con precios, combos, stock y módulos para tu comercio. ¿Qué necesitás?";

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export function PointOnceChatWidget() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [whatsappUrlHandoff, setWhatsappUrlHandoff] = useState<string | null>(null);
  const [showHandoff, setShowHandoff] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef(getChatSessionPhone());

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasUnread(false);
    }
  }, [messages, isOpen, isSending]);

  function openChat(): void {
    setIsOpen(true);
    trackEvent("chat_open", { product: "point_once" });
    if (messages.length === 0) {
      setMessages([{ id: "welcome", role: "bot", text: WELCOME_MESSAGE }]);
    }
  }

  function closeChat(): void {
    setIsOpen(false);
  }

  async function handleSend(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || isSending) {
      return;
    }

    setInput("");
    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);

    try {
      const response = await sendChatMessage(phoneRef.current, trimmed);
      applyBotResponse(response);
      trackEvent("chat_message", { product: "point_once", state: response.state });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "bot",
          text: `No pude conectar con el asistente ahora. Escribinos directo por WhatsApp y te atiende el equipo de ${AGENCIA_NAME}.`,
        },
      ]);
      setWhatsappUrlHandoff(whatsappUrl(WhatsAppMessages.general));
      setShowHandoff(true);
    } finally {
      setIsSending(false);
    }
  }

  function applyBotResponse(response: CoreChatResponse): void {
    setMessages((prev) => [
      ...prev,
      { id: `b-${Date.now()}`, role: "bot", text: response.reply },
    ]);
    if (response.whatsapp_url?.startsWith("https://wa.me/")) {
      setWhatsappUrlHandoff(response.whatsapp_url);
    }
    setShowHandoff(shouldShowWhatsAppHandoff(response));
    if (!isOpen) {
      setHasUnread(true);
    }
  }

  function openWhatsApp(): void {
    const url = whatsappUrlHandoff ?? whatsappUrl(WhatsAppMessages.general);
    trackEvent("whatsapp_click", { product: "point_once", label: "chat_handoff" });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const panelStyle: CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "min(78vh, 560px)",
        borderRadius: "20px 20px 0 0",
        zIndex: 200,
      }
    : {
        position: "fixed",
        right: 24,
        bottom: 88,
        width: 360,
        height: 480,
        borderRadius: 18,
        zIndex: 200,
      };

  return (
    <>
      {isOpen && (
        <div
          role="presentation"
          onClick={closeChat}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.35)",
            zIndex: 199,
          }}
        />
      )}

      {isOpen && (
        <div
          className="po-card po-card--elevated"
          style={{
            ...panelStyle,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(135deg, #1d4ed8, #1e3a5f)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p style={{ fontFamily: FD, fontSize: 15, fontWeight: 800, margin: 0 }}>
                Asistente Point Once
              </p>
              <p style={{ fontFamily: F, fontSize: 11, margin: "2px 0 0", opacity: 0.85 }}>
                Precios, stock y combos · {AGENCIA_NAME}
              </p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Cerrar chat"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 12px",
              background: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  padding: "10px 12px",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user" ? "#1d4ed8" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#0f172a",
                  fontFamily: F,
                  fontSize: 13,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                  border: msg.role === "bot" ? "1px solid #e2e8f0" : "none",
                  boxShadow: msg.role === "bot" ? "0 1px 4px rgba(15,23,42,0.04)" : "none",
                }}
              >
                {msg.text}
              </div>
            ))}
            {isSending && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  fontFamily: F,
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                Escribiendo…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && !isSending && (
            <div
              style={{
                padding: "0 12px 8px",
                background: "#f8fafc",
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => handleSend(prompt.text)}
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 10px",
                    borderRadius: 100,
                    border: "1px solid #bfdbfe",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    cursor: "pointer",
                  }}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          )}

          {showHandoff && whatsappUrlHandoff && (
            <div style={{ padding: "0 12px 10px", background: "#f8fafc" }}>
              <button
                type="button"
                onClick={openWhatsApp}
                style={{
                  width: "100%",
                  fontFamily: F,
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "11px 14px",
                  borderRadius: 11,
                  border: "none",
                  background: "#25d366",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MessageCircle size={16} />
                Continuar por WhatsApp
              </button>
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend(input);
            }}
            style={{
              padding: "10px 12px 12px",
              borderTop: "1px solid #e2e8f0",
              background: "#fff",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribí tu consulta…"
              disabled={isSending}
              style={{
                flex: 1,
                fontFamily: F,
                fontSize: 14,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1.5px solid #cbd5e1",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Enviar mensaje"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: "none",
                background: input.trim() && !isSending ? "#1d4ed8" : "#cbd5e1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isSending ? "pointer" : "not-allowed",
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={isOpen ? closeChat : openChat}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente Point Once"}
        style={{
          position: "fixed",
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 201,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 0 : 10,
          background: isOpen ? "#0f172a" : "#1d4ed8",
          color: "#fff",
          padding: isMobile ? "14px" : "13px 20px",
          borderRadius: 100,
          border: "none",
          fontFamily: F,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(29,78,216,0.45)",
        }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isMobile && !isOpen && "Consultá acá"}
        {hasUnread && !isOpen && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#facc15",
              border: "2px solid #fff",
            }}
          />
        )}
      </button>
    </>
  );
}
