# SPEC 06 — Modal Nueva publicación (sidebar)

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02, SPEC 04
> **Fecha:** 2026-11-12
> **Objetivo:** Reproducir `references/pantallas/crear-publicacion.dc.html` como un modal abierto desde el CTA «Nueva publicación» del sidebar, con selección de destinatarios y tipo, descripción validada y sin guardar nada.

## Scope

**In:**

- Modal overlay (sin cambiar URL) desde el CTA «Nueva publicación» del sidebar: backdrop `--color-backdrop` + tarjeta `#FBF4EC` de 580px, radio 24px, borde `#ECE0D0`, sombra `0 20px 50px -24px rgba(63,54,46,.35)`, centrada en el viewport.
- Header con copy y estilos exactos del mockup: «Cancelar» (`#94887B`, 15px, bold) a la izquierda, «Nueva publicación» (Fredoka 600, 18px, `#3F362E`) al centro, «Publicar» (`#D9583C`, 15px, extrabold) a la derecha; borde inferior `#ECE0D0`.
- Bloque PARA: label 12px extrabold, tracking .7px, `#94887B`; chips de los **8 niños de `MOCK_CHILDREN`** con primer nombre e inicial en avatar circular de 26px usando `avatarBg`/`avatarFg` del mock; multi-selección; seleccionada = fondo y borde `#3F362E` con texto blanco; no seleccionada = fondo `#FFFDF9`, borde `#ECE0D0`, texto `#6E6359`. Inicial: Mateo seleccionado.
- Chip «Toda la sala» sin avatar: clic marca a todos, otro clic los desmarca; se muestra seleccionada solo cuando todos los niños están marcados.
- Bloque TIPO: 7 chips (Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio) de 8px 16px, radio full, 13.5px extrabold; **selección única**: seleccionada = fondo sólido del color del tipo + texto blanco, no seleccionada = par suave (fondo suave + texto del color). Inicial: Actividad. Pares: comida `#9A7B1E`/`#F7E7A6`, siesta `#7B5FC0`/`#E7DCF6`, actividad `#2E89A6`/`#C7E7F1`, logro `#3E9B6C`/`#CFEBD8`, ánimo `#C56486`/`#F9D2DE`, foto `#D9684A`/`#FBD8CC`, anuncio `#4E72C8`/`#CCD8F4`.
- Bloque DESCRIPCIÓN: textarea vacío con placeholder «Contá cómo le fue hoy…», min-height 120px, resize vertical, padding 14px 16px, radio 14px, borde `#EADFD0`, fondo blanco, 15px/1.5, placeholder `#B6A99B`.
- Bloque FOTOS: dos tiles de 96px, radio 14px, fondo `#F4ECE1`; preview con icono cámara `#CBB89F` y borde `#ECE0D0`; tile «Agregar» con borde punteado `#DBCDBA`, icono + `#C5503A` y texto «Agregar» 12px `#B0A290`. Estáticos, sin handler.
- Validación: «Publicar» con descripción vacía o solo espacios mantiene el modal abierto y muestra error inline bajo el textarea (texto `clay-dark` + borde `clay`); escribir limpia el error. Con descripción válida cierra el modal sin guardar ni navegar. PARA no se valida.
- Cierre por Cancelar, clic en backdrop y Esc, sin validar; scroll de fondo bloqueado al abrir y restaurado al cerrar; al reabrir todo reiniciado (Mateo, Actividad, descripción vacía, sin errores).
- El CTA del sidebar deja de ser `<a href="#">` y pasa a `<button>` con el mismo estilo, que abre el modal.
- Responsive: bajo 640px tarjeta a ancho completo con márgenes de 24px y scroll interno si no cabe.

**Out of scope (para futuros specs):**

- Publicación real, persistencia, base de datos, actualización del feed o de los posts mock.
- Subida, selección o compresión real de fotos; galería.
- Destinatarios por familia o vista familia (`familia-*`).
- Cambios al resto del sidebar, nav o feed.

## Data model

Este spec no introduce datos persistentes. Reutiliza `MOCK_CHILDREN` de SPEC 02 y solo tiene estado UI local:

```ts
type PostType = "comida" | "siesta" | "actividad" | "logro" | "animo" | "foto" | "anuncio";

const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["mateo-fernandez"]));
const [type, setType] = useState<PostType>("actividad");
const [description, setDescription] = useState("");
const [error, setError] = useState<string | null>(null);
```

Primer nombre e inicial se derivan de `fullName` (`fullName.split(" ")[0]`); avatar con `avatarBg`/`avatarFg` del mock.

## Implementation plan

> Antes de escribir código: leer en `node_modules/next/dist/docs/` la guía de Client Components de Next.js 16.

1. `app/globals.css`: añadir solo el par faltante `--color-siesta: #7B5FC0` y `--color-siesta-soft: #E7DCF6`. El resto reutiliza tokens idénticos existentes: actividad/logro/anuncio, `badge-pending-*` (comida), `badge-invite-*` (ánimo), `badge-allergy-*` (foto). Manual: compila.
2. `app/_components/new-post-modal.tsx`: client component `NewPostButton` — botón con el estilo actual del CTA que abre el modal vía `createPortal` a `document.body` (el sidebar tiene `translate`/`transform` en mobile y romperían `fixed`): backdrop + tarjeta 580px con header Cancelar/título/Publicar. Cierre por Cancelar, backdrop y Esc (`useEffect` + `keydown`), bloqueo de scroll de fondo, render condicional (resetea el form al reabrir). Manual: abre y cierra por las tres vías sin navegar.
3. Bloques PARA y TIPO interactivos: chips de los 8 niños (toggle, inicial Mateo), «Toda la sala» toggle todos, TIPO selección única inicial Actividad con el sistema de pares de color. Manual: los toggles cambian estilos según selección.
4. DESCRIPCIÓN y FOTOS + validación de Publicar: textarea con placeholder, error inline estilo SPEC 04, escribir limpia el error, descripción válida cierra. Manual: vacío marca error; con texto, Publicar cierra sin guardar.
5. `app/_components/app-sidebar.tsx`: reemplazar el `<a href="#">` del CTA por `<NewPostButton />`. Manual: el botón abre el modal y el resto del sidebar queda idéntico.
6. Responsive: bajo 640px márgenes de 24px y scroll interno. Verificación final: `npm run lint`, `npx tsc --noEmit`, `npm run build` y capturas Playwright en `.playwright-mcp/` (`crear-publicacion.png` desktop, error y mobile) comparadas con el mockup.

## Acceptance criteria

- [x] El CTA «Nueva publicación» del sidebar abre el modal (backdrop + tarjeta centrada) sin cambiar de URL, desde cualquier página del shell. — ✅ Playwright: abre desde `/` y desde `/children/mateo-fernandez`; `location.pathname` sin cambio y modal presente en ambos (`document.body` contiene el portal `fixed inset-0`). Capturas `.playwright-mcp/crear-publicacion.png` y `.playwright-mcp/crear-publicacion-perfil.png`.
- [x] La tarjeta replica el mockup: fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra y ancho 580px; header con «Cancelar» `#94887B` / «Nueva publicación» en Fredoka / «Publicar» `#D9583C`. — ✅ Estilos computados: ancho `580px`, fondo `rgb(251,244,236)`, borde `1px rgb(236,224,208)`, radio `24px`, sombra con blur `20px 50px`; Cancelar `rgb(148,136,123)`/700, título Fredoka 600/18px `rgb(63,54,46)`, Publicar `rgb(217,88,60)`/800. Comparación visual con `.playwright-mcp/crear-publicacion-mockup.png`.
- [x] PARA muestra chips de los 8 niños con primer nombre, inicial y colores de avatar del mock; Mateo llega seleccionado. — ✅ Probe: 8 chips (Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas, Olivia) con iniciales M/S/B/V/T/E/L/O y avatares del mock (p. ej. Mateo `rgb(169,217,232)`/`rgb(31,122,147)`, Valentina `rgb(244,220,142)`/`rgb(154,123,30)`); `selected: true` solo en Mateo.
- [x] Las chips PARA conmutan entre estilo seleccionado (`#3F362E` + blanco) y no seleccionado (`#FFFDF9` + borde `#ECE0D0` + texto `#6E6359`). — ✅ Computed: Mateo seleccionada `rgb(63,54,46)` + texto blanco; Sofía sin marcar `rgb(255,253,249)` / borde `rgb(236,224,208)` / texto `rgb(110,99,89)`.
- [x] «Toda la sala» marca a todos con un clic, los desmarca con otro, y se ve seleccionada solo cuando todos están marcados. — ✅ Playwright: 1er clic → `selectedCount: 8` y chip oscura; 2do clic → `selectedCount: 0` y chip clara; con solo Mateo marcado queda clara.
- [x] TIPO muestra las 7 chips con sus pares de color; la selección es única, llega en Actividad, y la activa usa fondo sólido + texto blanco. — ✅ Probe: 7 chips; inicial Actividad sólida `rgb(46,137,166)` + blanco; Comida suave `rgb(247,231,166)`/`rgb(154,123,30)`; al elegir Logro, Logro pasa a sólida `rgb(62,155,108)`+blanco y Actividad vuelve a suave `rgb(199,231,241)`/`rgb(46,137,166)`; Siesta suave `rgb(231,220,246)`/`rgb(123,95,192)` (tras limpiar cache de Turbopack del dev server).
- [x] DESCRIPCIÓN entra vacía con placeholder «Contá cómo le fue hoy…» y los estilos del mockup. — ✅ Computed: `value: ""`, placeholder exacto, `min-height: 120px`, fondo blanco, borde `rgb(234,223,208)`, radio `14px`, fuente `15px`.
- [x] FOTOS muestra los dos tiles estáticos; «Agregar» no hace nada. — ✅ DOM: 2 tiles de 96px (`size-24`), preview con icono cámara y tile «Agregar» punteado; en el código son `<div>` sin handlers (estáticos por diseño).
- [x] Publicar con descripción vacía o solo espacios mantiene el modal y muestra el error inline (texto `clay-dark` + borde `clay`); escribir lo limpia. — ✅ Playwright: con vacío el modal permanece y aparece «Completá este campo.» en `rgb(217,88,60)` con borde `rgb(224,101,74)`; al escribir, `errorGone: true` y borde restaurado `rgb(234,223,208)`. Captura `.playwright-mcp/crear-publicacion-error.png`.
- [x] Publicar con descripción válida cierra el modal sin guardar ni crear posts. — ✅ Playwright: modal cerrado, URL `/`, portal ausente del DOM y sin navegación.
- [x] Cancelar, backdrop y Esc cierran sin validar; al reabrir: Mateo, Actividad, descripción vacía y sin errores. — ✅ Playwright: las tres vías cierran; probe al reabrir: `mateoDark: true`, `actividadSolid: true`, `taEmpty: true`, `noError: true`.
- [x] El scroll del fondo queda bloqueado con el modal abierto y se restaura al cerrar. — ✅ `document.body.style.overflow === "hidden"` abierto y `""` al cerrar (verificado tras Cancelar, backdrop, Esc y Publicar).
- [x] El resto del sidebar y de las páginas no cambia. — ✅ El diff solo toca `globals.css` (+2 tokens), `new-post-modal.tsx` (nuevo) y el `<a href="#">` del CTA en `app-sidebar.tsx`; capturas muestran sidebar, nav y feed intactos.
- [x] Bajo 640px el modal es completo y usable, con márgenes de 24px y sin cortes. — ✅ Playwright a 500×800: tarjeta 452px con 24px por lado, backdrop `overflow-y: auto`, contenido completo. Captura `.playwright-mcp/crear-publicacion-mobile.png`.
- [x] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan. — ✅ Los tres pasaron tras el último cambio de código; build prerenderizó 16/16 rutas.
- [x] Capturas Playwright en `.playwright-mcp/` (desktop, error y mobile) comparadas con el mockup. — ✅ `crear-publicacion.png` (desktop, CSS correcto), `crear-publicacion-error.png`, `crear-publicacion-mobile.png`, `crear-publicacion-mockup.png` (referencia servida por HTTP) y `crear-publicacion-perfil.png`; comparación visual confirma layout, copy y estilos equivalentes.

## Decisions

- **Sí:** modal en vez de página. Decisión del usuario; el mockup de pantalla completa se adapta a la convención de modales de SPEC 04/05.
- **Sí:** portal a `document.body`. Los `translate` del sidebar crean containing block de `fixed` en mobile y desalinearían el overlay.
- **Sí:** TIPO de selección única con sistema par suave/sólido; resuelve la ambigüedad del mockup (Comida y Actividad sólidas, el resto suaves).
- **Sí:** tipo inicial Actividad, coherente con la descripción de ejemplo del mockup.
- **Sí:** chips PARA con los 8 niños del mock (primer nombre) y estado inicial Mateo, como el mockup.
- **Sí:** Publicar valida solo la descripción; PARA queda opcional. Decisión del usuario.
- **Sí:** descripción válida cierra sin guardar («únicamente diseño», convención del repo).
- **Sí:** textarea vacío; el texto del mockup era demo.
- **Sí:** FOTOS estático, sin handler.
- **No:** ruta/página propia ni navegación al publicar.

## Risks

| Risk | Mitigation |
| --- | --- |
| El `fixed` del modal hereda el `translate`/`transform` del sidebar y queda mal posicionado en mobile | Renderizar con `createPortal` en `document.body` desde el paso 2 |
| 8 chips + 7 tipos desbordan la tarjeta | `flex-wrap` como en el mockup |
| Tecla Esc interfiere si hubiera otro modal abierto | Render condicional: solo un modal activo a la vez |

## What is **not** in this spec

- Publicar de verdad, persistencia, base de datos o actualizar el feed.
- Subida de fotos real.
- Vista familia y cambios a otras pantallas.
