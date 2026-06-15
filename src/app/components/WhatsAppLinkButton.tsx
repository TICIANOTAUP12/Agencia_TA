import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { trackEvent } from "../../lib/analytics";
import { fetchWhatsAppUrl } from "../../lib/coreApi";
import { whatsappUrl } from "../../lib/whatsapp";

interface WhatsAppLinkButtonProps {
  intent?: string;
  text?: string;
  fallbackMessage: string;
  trackLabel?: string;
  onAfterClick?: () => void;
  children: ReactNode;
  style?: CSSProperties;
}

export function WhatsAppLinkButton({
  intent,
  text,
  fallbackMessage,
  trackLabel,
  onAfterClick,
  children,
  style,
}: WhatsAppLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fallbackHref = whatsappUrl(fallbackMessage);

  async function handleClick(event: MouseEvent<HTMLAnchorElement>): Promise<void> {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    if (trackLabel) {
      trackEvent("whatsapp_click", { product: "point_once", label: trackLabel });
    }

    try {
      const url = await fetchWhatsAppUrl({ intent, text, fallbackMessage });
      window.open(url, "_blank", "noopener,noreferrer");
      onAfterClick?.();
    } catch {
      window.open(fallbackHref, "_blank", "noopener,noreferrer");
      onAfterClick?.();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <a
      href={fallbackHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-busy={isLoading}
      style={{
        ...style,
        opacity: isLoading ? 0.75 : 1,
        pointerEvents: isLoading ? "none" : undefined,
        cursor: isLoading ? "wait" : "pointer",
      }}
    >
      {isLoading ? "Abriendo WhatsApp…" : children}
    </a>
  );
}
