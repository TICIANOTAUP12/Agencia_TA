import { AGENCIA_NAME } from "../../../lib/whatsapp";

const POINT_LOGO_ISOTIPO = `${import.meta.env.BASE_URL}logo-point-isotipo.svg`;
const AGENCIA_LOGO_SRC = `${import.meta.env.BASE_URL}agencia-logo.png`;
const BODY_FONT = "'Inter', sans-serif";
const DISPLAY_FONT = "'Plus Jakarta Sans', sans-serif";

type BrandLogoProps = {
  iconSize?: number;
  light?: boolean;
};

export function BrandLogo({ iconSize = 36, light = false }: BrandLogoProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src={POINT_LOGO_ISOTIPO} alt="Point Sales" width={iconSize} height={iconSize} style={{ display: "block", objectFit: "contain", flexShrink: 0, background: "transparent" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: DISPLAY_FONT, fontSize: iconSize > 32 ? 26 : 20, fontWeight: 800, color: light ? "#fff" : "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.1 }}>Point Sales</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <img src={AGENCIA_LOGO_SRC} alt={AGENCIA_NAME} width={14} height={14} style={{ display: "block", objectFit: "contain", flexShrink: 0, background: "transparent" }} />
          <span style={{ fontFamily: BODY_FONT, fontSize: 9, fontWeight: 700, color: light ? "#60a5fa" : "#1e3a5f", letterSpacing: "0.14em", textTransform: "uppercase" }}>by {AGENCIA_NAME}</span>
        </div>
      </div>
    </div>
  );
}
