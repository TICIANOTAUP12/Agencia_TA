---
tipo: sprint-plan
origen: analisis-codigo
fecha: 2026-07-27
estado: borrador
plan: A
esfuerzo: S
---

# Plan de Sprint: Point Plan A — MVP mínimo

## 1. Resumen ejecutivo

- **Problema en una frase**: Falta un CTA claro desde el sitio corporativo hacia `/point/`, no hay bloque de financiación 50/50 + cuota, y el logo actual no coincide con los assets nuevos de CONTROL.
- **Impacto para usuario/negocio**: Visibilidad baja de Point desde la home; oferta de financiación no comunicada; branding desactualizado.
- **Severidad / prioridad sugerida**: Media-alta comercial; implementación chica.

## 2. Contexto

- **Área / servicio / módulos afectados**: `Point_landing` (Navbar), `Agencia_TA` (App.tsx, public logos, opcional analytics).
- **Entorno**: prod `sistemataup.online` + `/point/`; local ambos repos.
- **Enlaces**: Relevamiento CONTROL `Marketing/Point-Sales/Relevamiento-Point-landing-CTA-financiamiento-logos-2026-07-27.md`.

## 3. Análisis técnico

### 3.1 Síntomas observados

- Navbar corporativo sin link a Point.
- Combos muestran “6 cuotas”; no existe sección 50% + 3 meses.
- `BrandLogo` usa `point-logo.png` (brújula/carrito); CONTROL tiene SVG Point Sales (P + ámbar).

### 3.2 Hipótesis de causa raíz

| Hipótesis | Evidencia en código / datos | Estado |
|-----------|-----------------------------|--------|
| CTA ausente por omisión de producto | `Point_landing/src/app/components/Navbar.tsx` sin `/point/` | Confirmada |
| Financiación nueva solo en pedido oral | No hay `#financiacion` ni cálculo 50/50 en `App.tsx` | Confirmada |
| Logos nuevos no cableados al sitio actual | Assets solo en CONTROL; web usa `public/point-logo.png` | Confirmada |

### 3.3 Causa raíz confirmada (si aplica)

No es bug: gap de producto en landing actual + assets de marca listos en vault pero no en `public/`.

### 3.4 Alcance y límites

- **Qué está dentro del alcance**:
  - Botón/link nav en `Point_landing` → `/point/` (+ trackEvent opcional).
  - Sección `#financiacion` estática + calculadora simple (input o select de precios hardcode).
  - Reemplazo de `point-logo.png` / favicon por export del isotipo CONTROL (y opcional horizontal en header).
  - Link nav interno en Point: “Financiación”.
- **Qué queda explícitamente fuera**:
  - Rebrand de colores/tipografía.
  - Resolver conflicto “6 cuotas” vs 50/50 (solo disclaimer breve).
  - `point-sales-web`, POS Electron, backend de scoring crediticio.
  - Pisar WIP Meta Lead en `analytics.ts` / widgets.

## 4. Objetivo del Sprint

- **Resultado esperado al cerrar el sprint**: Desde la home se llega a Point en 1 clic; en Point se ve financiación 50/50 con cuota estimada; logo nuevo visible en header/footer.
- **Criterios de aceptación (checklist)**:
  - [ ] Nav corporativo tiene CTA “Point” → `/point/`
  - [ ] Sección `#financiacion` visible con copy 50/50, sin tarjeta, requisitos
  - [ ] Calculadora muestra seña = 50% y cuota ≈ (50%/N) con N≤3
  - [ ] Logo nuevo en header + footer (+ privacidad si aplica)
  - [ ] WIP Meta/analytics intacto
  - [ ] Smoke desktop + mobile

## 5. Plan de trabajo (backlog del sprint)

| ID | Tarea | Tipo | Estimación | Responsable | Dependencias |
|----|-------|------|------------|-------------|--------------|
| T1 | Confirmar fórmula cuota (lineal vs interés) y si aplica a todos los puestos | investigación | 30 min | Ticiano | — |
| T2 | Copiar/exportar logos CONTROL → `Agencia_TA/public/` | feature | 30–45 min | — | T1 opcional |
| T3 | CTA nav (+ mobile) en `Point_landing` Navbar | feature | 45 min | — | — |
| T4 | Sección `#financiacion` + calc mínima en `App.tsx` (o componente nuevo) | feature | 2–3 h | — | T1 |
| T5 | Nav Point: link Financiación; eventos `financing_view` / `cta_point_nav` sin romper Meta Lead | feature | 45 min | — | T3, T4 |
| T6 | Build + smoke `/` y `/point/` | test | 30 min | — | T2–T5 |

## 6. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Copy “6 cuotas” vs “3 meses” confunde | A | M | Disclaimer en sección; Plan B alinea |
| SVG provisional se ve mal a favicon sizes | M | B | Export PNG 32/180 desde isotipo |
| WIP analytics conflict | M | M | Extender `trackEvent`/`trackMetaLead`, no reescribir |

## 7. Pruebas y validación

- **Casos de prueba manuales**: click nav → Point; scroll financiación; calc con 3 precios de combo; logo claro en header blanco y footer oscuro.
- **Pruebas automáticas**: N/A (no hay suite UI).
- **Feature flags / rollback**: revert commits por repo; assets viejos en git history.

## 8. Despliegue y seguimiento

- **Estrategia de release**: build `Point_landing` + `Agencia_TA`; deploy S1 como hoy (`ta-landing` + estático `/point/`).
- **Métricas**: GA `cta_point_nav`, `financing_calc_interact`; Meta Lead solo en WA.
- **Criterio de “hecho” operativo**: CTA live en prod + sección visible + logo nuevo en `/point/`.

## 9. Notas y decisiones

- **Decisiones**: Sitio canónico = `Agencia_TA`, no `point-sales-web`.
- **Preguntas abiertas**: ver relevamiento §7 (interés, scope hardware, rename marca).
- **UX/copy**: ver índice CONTROL `Planes-CTA-financiamiento-logos-2026-07-27.md`.
- **Archivos previstos**:
  - `Point_landing/src/app/components/Navbar.tsx` (+ analytics si existe)
  - `Agencia_TA/public/point-logo.png` (+ svg opcionales)
  - `Agencia_TA/src/app/App.tsx` (Header, sección nueva, BrandLogo)
  - `Agencia_TA/src/app/pages/PrivacyPolicyPage.tsx` (logo)
  - `Agencia_TA/src/lib/seo.ts` (favicon si cambia nombre)
  - Opcional: `Agencia_TA/src/lib/analytics.ts` (solo agregar eventos; respetar WIP)
