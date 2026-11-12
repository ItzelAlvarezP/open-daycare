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

- [ ] El CTA «Nueva publicación» del sidebar abre el modal (backdrop + tarjeta centrada) sin cambiar de URL, desde cualquier página del shell.
- [ ] La tarjeta replica el mockup: fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra y ancho 580px; header con «Cancelar» `#94887B` / «Nueva publicación» en Fredoka / «Publicar» `#D9583C`.
- [ ] PARA muestra chips de los 8 niños con primer nombre, inicial y colores de avatar del mock; Mateo llega seleccionado.
- [ ] Las chips PARA conmutan entre estilo seleccionado (`#3F362E` + blanco) y no seleccionado (`#FFFDF9` + borde `#ECE0D0` + texto `#6E6359`).
- [ ] «Toda la sala» marca a todos con un clic, los desmarca con otro, y se ve seleccionada solo cuando todos están marcados.
- [ ] TIPO muestra las 7 chips con sus pares de color; la selección es única, llega en Actividad, y la activa usa fondo sólido + texto blanco.
- [ ] DESCRIPCIÓN entra vacía con placeholder «Contá cómo le fue hoy…» y los estilos del mockup.
- [ ] FOTOS muestra los dos tiles estáticos; «Agregar» no hace nada.
- [ ] Publicar con descripción vacía o solo espacios mantiene el modal y muestra el error inline (texto `clay-dark` + borde `clay`); escribir lo limpia.
- [ ] Publicar con descripción válida cierra el modal sin guardar ni crear posts.
- [ ] Cancelar, backdrop y Esc cierran sin validar; al reabrir: Mateo, Actividad, descripción vacía y sin errores.
- [ ] El scroll del fondo queda bloqueado con el modal abierto y se restaura al cerrar.
- [ ] El resto del sidebar y de las páginas no cambia.
- [ ] Bajo 640px el modal es completo y usable, con márgenes de 24px y sin cortes.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan.
- [ ] Capturas Playwright en `.playwright-mcp/` (desktop, error y mobile) comparadas con el mockup.

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
