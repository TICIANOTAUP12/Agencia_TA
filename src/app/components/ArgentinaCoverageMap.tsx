import { useState } from "react";
import { MapPin } from "lucide-react";
import { AGENCIA_NAME } from "../../lib/whatsapp";

const F = "'Inter', sans-serif";
const FD = "'Plus Jakarta Sans', sans-serif";

const ARGENTINA_MAP_SRC = `${import.meta.env.BASE_URL}argentina-map.svg`;

type CoverageZone = {
  id: string;
  name: string;
  clients: number;
  /** Porcentaje sobre el mapa SVG (viewBox 1000×1000) */
  leftPct: number;
  topPct: number;
  accent: string;
};

/** Zonas con presencia comercial — números orientativos de clientes atendidos. */
const COVERAGE_ZONES: CoverageZone[] = [
  { id: "san-juan", name: "San Juan", clients: 18, leftPct: 38.5, topPct: 39.5, accent: "#1d4ed8" },
  { id: "mendoza", name: "Mendoza", clients: 5, leftPct: 37.2, topPct: 45.5, accent: "#2563eb" },
  { id: "san-luis", name: "San Luis", clients: 2, leftPct: 43.5, topPct: 43.8, accent: "#3b82f6" },
  { id: "cordoba", name: "Córdoba", clients: 6, leftPct: 48.5, topPct: 39.2, accent: "#1e40af" },
  { id: "caba", name: "Buenos Aires (CABA)", clients: 4, leftPct: 57.5, topPct: 47.8, accent: "#1e3a5f" },
];

const TOTAL_ZONE_CLIENTS = COVERAGE_ZONES.reduce((sum, z) => sum + z.clients, 0);

function markerSize(clients: number): number {
  return Math.max(28, Math.min(44, 24 + clients * 0.9));
}

type ArgentinaCoverageMapProps = {
  isMobile: boolean;
};

export function ArgentinaCoverageMap({ isMobile }: ArgentinaCoverageMapProps) {
  const [activeId, setActiveId] = useState<string | null>("san-juan");
  const active = COVERAGE_ZONES.find((z) => z.id === activeId) ?? COVERAGE_ZONES[0];

  return (
    <section
      id="cobertura"
      className="po-section-surface--alt"
      style={{ padding: isMobile ? "64px 20px" : "96px 24px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 48 }}>
          <span
            style={{
              fontFamily: F,
              fontSize: 12,
              fontWeight: 700,
              color: "#1d4ed8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 10,
            }}
          >
            {AGENCIA_NAME} · Cobertura
          </span>
          <h2
            style={{
              fontFamily: FD,
              fontSize: isMobile ? "clamp(24px,7vw,36px)" : "clamp(28px,4vw,42px)",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              margin: "0 0 14px 0",
            }}
          >
            Clientes con los que{" "}
            <span style={{ color: "#1d4ed8" }}>hemos trabajado</span>
          </h2>
          <p
            style={{
              fontFamily: F,
              fontSize: isMobile ? 15 : 17,
              color: "#64748b",
              lineHeight: 1.7,
              margin: "0 auto",
              maxWidth: 560,
            }}
          >
            Presencia en el centro-oeste y el Litoral: San Juan como base, con comercios
            acompañados en Mendoza, San Luis, Córdoba y Buenos Aires Capital.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
            gap: isMobile ? 28 : 48,
            alignItems: "center",
          }}
        >
          <div
            className="po-card po-card--elevated"
            style={{
              borderRadius: 24,
              padding: isMobile ? 16 : 28,
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(165deg, #f8fafc 0%, #eff6ff 48%, #dbeafe 100%)",
            }}
          >
            <style>{`
              @keyframes po-map-pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
                50% { transform: translate(-50%, -50%) scale(1.7); opacity: 0; }
              }
              @keyframes po-map-float {
                0%, 100% { transform: translate(-50%, -50%) translateY(0); }
                50% { transform: translate(-50%, -50%) translateY(-3px); }
              }
              .po-map-pulse-ring {
                animation: po-map-pulse 2.4s ease-out infinite;
              }
              .po-map-pin-active {
                animation: po-map-float 2.8s ease-in-out infinite;
              }
            `}</style>

            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: isMobile ? 300 : 380,
                margin: "0 auto",
                aspectRatio: "1 / 1",
              }}
            >
              <img
                src={ARGENTINA_MAP_SRC}
                alt="Mapa de la República Argentina"
                width={1000}
                height={1000}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />

              {COVERAGE_ZONES.map((zone) => {
                const isActive = zone.id === activeId;
                const size = markerSize(zone.clients);
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setActiveId(zone.id)}
                    onMouseEnter={() => setActiveId(zone.id)}
                    onFocus={() => setActiveId(zone.id)}
                    aria-label={`${zone.name}: ${zone.clients} clientes`}
                    aria-pressed={isActive}
                    style={{
                      position: "absolute",
                      left: `${zone.leftPct}%`,
                      top: `${zone.topPct}%`,
                      width: size,
                      height: size,
                      margin: 0,
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      zIndex: isActive ? 3 : 2,
                    }}
                  >
                    {isActive && (
                      <span
                        className="po-map-pulse-ring"
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: size + 14,
                          height: size + 14,
                          borderRadius: "50%",
                          background: zone.accent,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    <span
                      className={isActive ? "po-map-pin-active" : undefined}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        background: isActive ? zone.accent : "#64748b",
                        border: "3px solid #fff",
                        boxShadow: isActive
                          ? "0 4px 14px rgba(29,78,216,0.45)"
                          : "0 2px 8px rgba(15,23,42,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: F,
                        fontSize: size > 34 ? 13 : 11,
                        fontWeight: 800,
                        color: "#fff",
                        transition: "background 0.2s ease",
                      }}
                    >
                      {zone.clients}
                    </span>
                  </button>
                );
              })}
            </div>

            <p
              style={{
                fontFamily: F,
                fontSize: 11,
                color: "#64748b",
                textAlign: "center",
                margin: "12px 0 0",
              }}
            >
              Tocá una zona para ver el detalle
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              className="po-card-chip"
              style={{
                borderRadius: 14,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MapPin size={20} color="#1d4ed8" />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: FD,
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {TOTAL_ZONE_CLIENTS}+ clientes en estas zonas
                </p>
                <p style={{ fontFamily: F, fontSize: 12, color: "#64748b", margin: 0 }}>
                  +200 comercios activos en todo el país
                </p>
              </div>
            </div>

            {COVERAGE_ZONES.map((zone) => {
              const isActive = zone.id === activeId;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveId(zone.id)}
                  onMouseEnter={() => setActiveId(zone.id)}
                  className="po-card po-card--interactive"
                  style={{
                    borderRadius: 14,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    border: isActive ? "1.5px solid #93c5fd" : undefined,
                    background: isActive ? "#eff6ff" : undefined,
                    boxShadow: isActive
                      ? "0 4px 16px rgba(29,78,216,0.12)"
                      : undefined,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: zone.accent,
                        flexShrink: 0,
                        boxShadow: isActive
                          ? `0 0 0 4px ${zone.accent}22`
                          : "none",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FD,
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {zone.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: 13,
                      fontWeight: 700,
                      color: isActive ? "#1d4ed8" : "#64748b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {zone.clients}{" "}
                    {zone.clients === 1 ? "cliente" : "clientes"}
                  </span>
                </button>
              );
            })}

            <p
              style={{
                fontFamily: F,
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.6,
                margin: "8px 0 0",
              }}
            >
              Destacada:{" "}
              <strong style={{ color: "#1e3a5f" }}>{active.name}</strong> —{" "}
              {active.clients} comercios con los que trabajamos en esa zona.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
