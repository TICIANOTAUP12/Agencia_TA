---
tipo: sprint-plan
origen: analisis-codigo
fecha: 2026-07-27
estado: borrador
plan: B
esfuerzo: M
recomendado: true
---

# Plan de Sprint: Point Plan B — Comercial integrado (recomendado)

## 1. Resumen ejecutivo

- **Problema en una frase**: Point no se descubre desde la home corporativa; la oferta real de financiación (50% + 3 meses sin tarjeta) no está modelada ni reconciliada con las “6 cuotas” de las cards; logos desactualizados.
- **Impacto para usuario/negocio**: Mayor funnel home→Point→WA con mensaje financiero coherente y marca alineada a CONTROL.
- **Severidad / prioridad sugerida**: Alta comercial.

## 2. Contexto

- **Área / servicio / módulos afectados**: `Point_landing` (Navbar, Hero/Soluciones), `Agencia_TA` (App secciones, precios, BrandLogo, whatsapp messages, analytics), assets CONTROL.
- **Entorno**: prod + local.
- **Enlaces**: Relevamiento + índice de planes en CONTROL `Marketing/Point-Sales/`.

## 3. Análisis técnico

### 3.1 Síntomas observados

- Sin CTA `/point/` en corporativo.
- Financiación en UI = “6 cuotas de $X” en `puestos[]`; pedido nuevo = 50% entrega + 50% hasta 3 meses sin TC + requisitos espacio/cuenta verificada.
- Logos CONTROL (Point Sales) ≠ `point-logo.png` actual.
- WIP Meta Lead en CTAs WA / chat — hay que extender, no romper.

### 3.2 Hipótesis de causa raíz

| Hipótesis | Evidencia | Estado |
|-----------|-----------|--------|
| Producto Point creció en subpath sin entrada desde home | Navbar sin Point; diario menciona Meta en ambos sitios | Confirmada |
| Modelo de cuotas viejo (6) vs oferta nueva (50/50×3) | `App.tsx` cuotas hardcode vs pedido 2026-07-27 | Confirmada (conflicto de copy) |
| Branding Point Sales armado en vault, no en landing prod | CONTROL assets + Branding.md provisional | Confirmada |

### 3.3 Causa raíz confirmada (si aplica)

Gap de producto + inconsistencia comercial de financiación; no es falla de runtime.

### 3.4 Alcance y límites

- **Qué está dentro del alcance**:
  - CTA nav + al menos un CTA secundario (hero slide o card Soluciones) en `Point_landing` → `/point/` (ideal deep-link `/point/#financiacion` o `/point/#combos`).
  - Sección financiación completa con calculadora ligada a precios de `puestos` (y qty Cymax si aplica).
  - Alinear cards: reemplazar o etiquetar “6 cuotas” (p.ej. “otra vía / consultar”) vs bloque “Financiación Point sin tarjeta”.
  - Logos: isotipo + variante horizontal claro (header) / apta footer oscuro; actualizar favicon/apple-touch si hace falta.
  - Mensaje WA dedicado + `trackLabel` financiación; eventos GA para CTA Point y uso de calc.
  - Nav Point: Financiación entre Combos y Garantía.
- **Qué queda explícitamente fuera**:
  - Rebrand total carbón/ámbar / Outfit (eso es Plan C).
  - Migrar a `point-sales-web`.
  - Motor de crédito, scoring, formularios KYC backend.
  - Cambiar número WhatsApp o promesas del chat bot sin brief aparte.

## 4. Objetivo del Sprint

- **Resultado esperado al cerrar el sprint**: Visitante corporativo → Point → entiende seña/cuota → WhatsApp con mensaje prearmado; marca visual nueva sin rediseñar toda la landing.
- **Criterios de aceptación (checklist)**:
  - [ ] ≥1 CTA Point en nav + ≥1 en hero/soluciones
  - [ ] `#financiacion` con copy 50/50, sin TC, requisitos, calc correcta
  - [ ] Cards de precio no contradicen el mensaje principal (etiqueta clara)
  - [ ] Logos nuevos en header/footer/privacidad
  - [ ] `WhatsAppMessages` + trackLabel `financiacion_*`
  - [ ] Meta Lead / WIP preservados
  - [ ] Smoke mobile: nav, calc, WA

## 5. Plan de trabajo (backlog del sprint)

| ID | Tarea | Tipo | Estimación | Responsable | Dependencias |
|----|-------|------|------------|-------------|--------------|
| T0 | Decisión negocio: ¿reemplazar 6 cuotas, dual-label, o ocultar 6 cuotas? | investigación | 1 h | Ticiano | — |
| T1 | Fórmula cuota + alcance (hardware only?) documentada en CONTROL | docs | 30 min | — | T0 |
| T2 | Assets: SVG/PNG desde CONTROL → `public/` (+ variantes) | feature | 1 h | — | — |
| T3 | `Point_landing`: Navbar + Hero/Soluciones CTA | feature | 1.5–2 h | — | — |
| T4 | Extraer o crear `FinancingSection` + calc reutilizando precios `puestos` | feature | 3–4 h | — | T1 |
| T5 | Ajustar copy cards / `WhatsAppMessages` / feature “precio” | feature | 1–2 h | — | T0, T4 |
| T6 | Analytics: `cta_point_nav`, `cta_point_hero`, `financing_calc`, WA labels | feature | 1 h | — | T3–T5 |
| T7 | BrandLogo: isotipo + wordmark (mantener “by Agencia TA” salvo decisión contraria) | feature | 1 h | — | T2 |
| T8 | Build ambos repos + smoke prod staging | test | 1 h | — | T2–T7 |

## 6. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Sin T0, calc y cards mienten | A | A | Bloquear T4/T5 hasta decisión |
| Deep-link `#financiacion` no scrollea con header fixed | M | B | `scroll-margin-top` / offset |
| Wordmark “Point Sales” vs “Point Once” | A | M | Mantener texto “Point Once” y solo ícono nuevo, o confirmar rename |
| Blast radius App.tsx monolítico | M | M | Componente nuevo; no refactor masivo |
| WIP Meta Lead | M | A | Solo append eventos; no reordenar init Pixel |

## 7. Pruebas y validación

- **Casos de prueba manuales**:
  - Home → Point (nav y hero).
  - Calc: puesto $1.050.000 → seña $525.000 → 3 cuotas $175.000 (si lineal).
  - WA desde sección con texto que menciona 50/50.
  - Footer oscuro: logo legible.
- **Pruebas automáticas**: N/A.
- **Feature flags / rollback**: deploy por artefacto; conservar PNG viejo como `point-logo.legacy.png` una release.

## 8. Despliegue y seguimiento

- **Estrategia de release**: primero assets+sección Point; después CTA corporativo (o al revés: CTA a sección ya live).
- **Métricas**: ratio `cta_point_*` → `whatsapp_click` label financiación; Meta Lead sin cambio de contrato.
- **Criterio de “hecho” operativo**: 1 lead de prueba WA con mensaje de financiación + screenshot logo nuevo.

## 9. Notas y decisiones

- **Por qué este plan**: maximiza conversión con diff contenido; respeta “nos quedamos con el sitio actual”.
- **Preguntas abiertas**: T0 + rename marca + interés.
- **Archivos previstos**:
  - `Point_landing/src/app/components/Navbar.tsx`
  - `Point_landing/src/app/components/Hero.tsx` y/o sección Soluciones
  - `Point_landing` analytics (si hay `trackEvent` local)
  - `Agencia_TA/src/app/App.tsx`
  - `Agencia_TA/src/app/components/FinancingSection.tsx` (nuevo, preferible)
  - `Agencia_TA/src/lib/whatsapp.ts`
  - `Agencia_TA/src/lib/analytics.ts` (append only; WIP)
  - `Agencia_TA/public/*logo*`
  - `Agencia_TA/src/app/pages/PrivacyPolicyPage.tsx`
  - `Agencia_TA/src/lib/seo.ts`
  - Opcional chat chips: `PointOnceChatWidget.tsx` (WIP — solo si se agrega chip “Financiación” con cuidado)
