---
tipo: sprint-plan
origen: analisis-codigo
fecha: 2026-07-27
estado: borrador
plan: D
esfuerzo: S-M
---

# Plan de Sprint: Point Plan D — Solo Agencia_TA (sin Point_landing)

## 1. Resumen ejecutivo

- **Problema en una frase**: Se necesita financiación + logos en Point, pero el “botón nuevo” se interpreta como CTA **dentro** de la landing Point (scroll a sección / abrir chat), sin tocar el sitio corporativo.
- **Impacto para usuario/negocio**: Mejora la página Point; **no** soluciona descubrimiento desde `sistemataup.online` raíz.
- **Severidad / prioridad sugerida**: Útil solo si el tráfico ya entra directo a `/point/` (ads, IG).

## 2. Contexto

- **Área**: únicamente `Agencia_TA`.
- **Entorno**: `/point/`.
- **Enlaces**: relevamiento CONTROL.

## 3. Análisis técnico

### 3.1 Síntomas observados

Idem financiación y logos; el gap de Navbar corporativo **queda sin cerrar**.

### 3.2 Hipótesis de causa raíz

| Hipótesis | Evidencia | Estado |
|-----------|-----------|--------|
| “Nuevo botón” = CTA interno a sección Point/financiación | Hero ya tiene CTAs a `#combos` / demo; falta `#financiacion` | Plausible |
| Tráfico principal ya es `/point/` vía ads | Pendiente verificar en GA | Pendiente de verificación |

### 3.3 Causa raíz confirmada (si aplica)

N/A — escenario de alcance reducido.

### 3.4 Alcance y límites

- **Dentro**: Nav link Financiación; hero CTA “Ver financiación”; sección + calc; logos; analytics locales; opcional chip chat “Financiación”.
- **Fuera**: Cualquier cambio en `Point_landing`; rebrand C; `point-sales-web`.

## 4. Objetivo del Sprint

- **Resultado**: `/point/` comunica y calcula la oferta 50/50; marca visual actualizada.
- **Criterios de aceptación**:
  - [ ] `#financiacion` + calc
  - [ ] CTA hero/header a esa sección
  - [ ] Logos nuevos
  - [ ] Sin regresiones WA/chat/Meta WIP

## 5. Plan de trabajo (backlog del sprint)

| ID | Tarea | Tipo | Estimación | Dependencias |
|----|-------|------|------------|--------------|
| T1 | Decisión fórmula cuota | investigación | 30 min | — |
| T2 | Assets logos | feature | 45 min | — |
| T3 | FinancingSection + calc + nav/hero anchors | feature | 3–4 h | T1 |
| T4 | Ajuste copy 6 cuotas (mínimo disclaimer) | feature | 1 h | T1 |
| T5 | Eventos analytics append-only | feature | 45 min | T3 |
| T6 | Smoke `/point/` | test | 30 min | T2–T5 |

## 6. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| No cumple pedido “redirigir a Point” desde home | A | A | Preferir Plan A/B si el CTA es corporativo |
| Usuarios home nunca ven Point | A | A | Medir tráfico referrer; agregar CTA después |

## 7. Pruebas y validación

- Anclas con header fixed; calc; logos; WA.

## 8. Despliegue y seguimiento

- Solo deploy artefacto `/point/`.
- Si GA muestra mucho tráfico en `/` sin ir a `/point/`, escalar a Plan B.

## 9. Notas y decisiones

- Usar como **fase 1** solo si se confirma que el botón pedido es interno.
- **Archivos previstos**:
  - `Agencia_TA/src/app/App.tsx`
  - `Agencia_TA/src/app/components/FinancingSection.tsx` (nuevo)
  - `Agencia_TA/public/*`
  - `Agencia_TA/src/lib/whatsapp.ts`
  - `Agencia_TA/src/lib/analytics.ts` (WIP-safe)
  - `PrivacyPolicyPage.tsx` / `seo.ts` si favicon
