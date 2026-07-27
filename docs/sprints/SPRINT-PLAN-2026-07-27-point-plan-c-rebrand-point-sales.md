---
tipo: sprint-plan
origen: analisis-codigo
fecha: 2026-07-27
estado: borrador
plan: C
esfuerzo: L
---

# Plan de Sprint: Point Plan C — Rebrand Point Sales sobre sitio actual

## 1. Resumen ejecutivo

- **Problema en una frase**: Además del CTA y la financiación, la landing Point Once (azul/Inter) no refleja el brand book Point Sales (carbón/ámbar/Outfit) ya documentado en CONTROL.
- **Impacto para usuario/negocio**: Coherencia RRSS ↔ web; costo alto de rediseño y riesgo de romper conversión conocida.
- **Severidad / prioridad sugerida**: Baja-media ahora; alta solo si se decide unificar marca pública.

## 2. Contexto

- **Área / servicio / módulos afectados**: Casi toda la UI de `Agencia_TA` (`App.tsx`, `point-cards.css`, tipografías, SEO naming) + CTAs `Point_landing` + assets CONTROL.
- **Entorno**: prod `/point/`.
- **Enlaces**: `CONTROL/Marketing/Point-Sales/Branding.md` (logo aún provisional).

## 3. Análisis técnico

### 3.1 Síntomas observados

- Paleta actual: azules `#1d4ed8` / `#0f172a`, fonts Inter + Plus Jakarta.
- Brand book: ink `#1a1f26`, ámbar `#e8a317`, Paper `#f3f1ec`, Outfit + Source Sans 3.
- Nombre UI “Point Once” vs wordmark “Point Sales”.

### 3.2 Hipótesis de causa raíz

| Hipótesis | Evidencia | Estado |
|-----------|-----------|--------|
| Landing nació como Point Once; marca comercial se separó después | Branding.md separación de marcas; Producto.md | Confirmada |
| Logo/SVG aún provisional | Branding §5 checklist abierto | Confirmada |

### 3.3 Causa raíz confirmada (si aplica)

Divergencia intencional de marcas; rebrand web es decisión, no bug.

### 3.4 Alcance y límites

- **Dentro**: Todo Plan B + tokens CSS/vars, tipografías, ajuste hero/CTA colors, rename copy “Point Sales” donde corresponda, logos horizontales, posible OG image.
- **Fuera**: Lanzar `point-sales-web` como reemplazo; rediseñar sitio corporativo TAUP entero; fotos reales de producto (pendiente brand book).

## 4. Objetivo del Sprint

- **Resultado esperado**: `/point/` se lee como Point Sales (Cuyo) alineado a RRSS, con financiación y CTA corporativo.
- **Criterios de aceptación**:
  - [ ] Criterios del Plan B cumplidos
  - [ ] Tokens de color/tipo según Branding.md
  - [ ] Wordmark coherente (Once vs Sales resuelto)
  - [ ] Contraste WCAG razonable en CTAs ámbar
  - [ ] OG/favicon actualizados

## 5. Plan de trabajo (backlog del sprint)

| ID | Tarea | Tipo | Estimación | Dependencias |
|----|-------|------|------------|--------------|
| T0 | Aprobar rename Point Once → Point Sales en web | investigación | 1 h | — |
| T1 | Completar o congelar logo “provisional = ok para prod” | docs | 1 h | — |
| T2 | Ejecutar backlog Plan B (CTA + finanzas + calc) | feature | 1.5–2.5 d | T0 |
| T3 | Introducir CSS variables + migrar inline styles críticos | tech-debt | 1–2 d | T1 |
| T4 | Tipografías Outfit / Source Sans 3 | feature | 0.5 d | T3 |
| T5 | SEO/privacy strings + OG | feature | 0.5 d | T0 |
| T6 | QA visual mobile/desktop + regresión CTAs | test | 0.5 d | T2–T5 |

## 6. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Caída de conversión por cambio visual brusco | M | A | A/B informal; o diferir C | 
| Logo provisional queda “final” por inercia | A | M | Fecha de revisión en Branding |
| Diff >5 archivos / monolito App.tsx | A | M | Componentizar por sección; no big-bang sin OK |
| Confusión marca Agencia TAUP vs Point | M | M | Mantener “by Agencia” discreto según Branding §2 |

## 7. Pruebas y validación

- Checklist visual vs Branding.md; smoke CTAs; Lighthouse contrast opcional.
- Rollback: branch de rebrand separada; Plan B puede mergearse antes.

## 8. Despliegue y seguimiento

- Release en rama `point-rebrand`; merge solo tras OK de Ticiano en staging.
- Vigilar bounce y `whatsapp_click` 7 días.

## 9. Notas y decisiones

- **No recomendado ahora** si el pedido es “solo logos + financiación + botón”.
- **Archivos previstos** (además de Plan B): `src/styles/point-cards.css`, `index.html` fonts, posiblemente casi todos los bloques de `App.tsx`, `seo.ts`, `privacyPolicy.ts`.
