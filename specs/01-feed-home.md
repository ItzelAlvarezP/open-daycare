# SPEC 01 — Feed de la sala como Home (`/`)

> **Estado:** Implementado
> **Depende de:** ninguna
> **Fecha:** 2026-11-10
> **Objetivo:** Reproducir en `/` la pantalla `references/pantallas/feed.dc.html` de manera fiel con datos mock, sin autenticación ni base de datos, con degradación simple a móvil mediante drawer.

## Scope

**In:**

- Sidebar del mockup (logo, CTA "Nueva publicación", nav Feed/Niños/Avisos/Mi cuenta, tarjeta de Caro) montado en el layout raíz.
- Feed en `/`: encabezado ("GUARDERÍA · SALA SOLES", "Buenas, Caro", "12 niños · martes 17 jun"), composer estático, divisor "PUBLICADO HOY" y 3 posts (LOGRO, ACTIVIDAD con placeholder de foto, ANUNCIO) desde datos mock.
- Tipografía Fredoka + Nunito con `next/font/google` y tokens de color del design system (en `@theme`).
- Drawer con botón hamburguesa para pantallas angostas (< 768px).

**Out of scope (para futuros specs):**

- Pantallas Niños / Avisos / Mi cuenta / Crear publicación / Detalle / Login.
- Autenticación y roles (maestra vs familia).
- Base de datos o persistencia: los likes y comentarios son números estáticos.
- Interactividad real (dar like, comentar, editar); los enlaces apuntan a `#`.
- Foto real publicada: el mockup solo trae el placeholder punteado, se dibuja tal cual (SVG + copy).

## Data model

```ts
// lib/mock-posts.ts
export type PostType = "logro" | "actividad" | "anuncio";

export type MockPost = {
  id: string;
  type: PostType;
  author: string;         // "Mateo" | "Anuncio general"
  initial: string | null; // null → avatar con icono (megáfono, solo anuncios)
  time: string;           // "14:20"
  audience: string;       // "familia de Mateo" | "toda la sala"
  body: string;
  photoCaption?: string;  // solo actividad con foto
  likes: number;
  comments: number;
};

export const MOCK_SESSION = {
  fullName: "Caro Giménez",
  greeting: "Buenas, Caro",
  role: "Maestra",
  room: "Soles",
  meta: "12 niños · martes 17 jun", // estático, decisión de este spec
};
```

## Implementation plan

> Antes de escribir código: leer las guías relevantes de Next 16 en `node_modules/next/dist/docs/` (cacheComponents/prefetching ya configurados; `runtime` está prohibido como export por segmento).

1. `app/globals.css`: definir tokens en `@theme` (colores y radios del design system) y reemplazar las variables del starter Geist. Manual: `npm run dev` pinta el fondo crema `#F6ECDF`.
2. `app/layout.tsx`: `next/font/google` (Fredoka, Nunito), `<html lang="es">`, metadata "OpenDayCare". La app compila sin fuentes Geist.
3. `app/_components/app-sidebar.tsx`: sidebar estático fiel al mockup (248px, sticky, SVGs inline). Manual: se ve a la izquierda del feed.
4. `lib/mock-posts.ts`: tipo `MockPost` + los 3 posts del mockup. Compila.
5. `app/page.tsx`: feed completo consumiendo el mock (encabezado, composer, divisor, 3 tarjetas con pill, corazón, comentario, "Editar"). Manual: la página replica `feed.dc.html`.
6. Drawer + hamburguesa en `app-sidebar.tsx` para ancho < 768px, reutilizando los estilos ya existentes. Manual: resize a 500px y el menu abre/cierra.
7. Verificación final: `npm run lint`, `npx tsc --noEmit`, `npm run build` y captura Playwright en `.playwright-mcp/`.

## Acceptance criteria

- [x] `/` muestra el copy exacto del mockup, incluidos los 3 textos de post, las 3 pills de tipo y el "Foto · pintando con témperas" en el post ACTIVIDAD. — ✅ `lib/mock-posts.ts:26-61` replica línea a línea `feed.dc.html` (3 cuerpos, audiencia, horas, likes/comentarios); render verificado en `.playwright-mcp/feed.png`.
- [x] Las pills usan los colores del design system: LOGRO `#3E9B6C`/`#CFEBD8`, ACTIVIDAD `#2E89A6`/`#C7E7F1`, ANUNCIO `#4E72C8`/`#CCD8F4`. — ✅ Computado en vivo: `rgb(62,155,108)`/`rgb(207,235,216)`, `rgb(46,137,166)`/`rgb(199,231,241)`, `rgb(78,114,200)`/`rgb(204,216,244)`; tokens en `app/globals.css:32-37`.
- [x] "Nueva publicación" usa el gradiente `#F4977E → #EE8164` con sombra del mockup. — ✅ Computado: `linear-gradient(in oklab, rgb(244,151,126), rgb(238,129,100))` (extremos exactos; Tailwind 4 interpola en oklab) + sombra `rgba(238,129,100,0.75) 0 8px 18px -8px` = `0 8px 18px -8px rgba(238,129,100,.75)` del mockup.
- [x] Los títulos renderizan en Fredoka y el cuerpo en Nunito (fuentes self-hosted por `next/font`, sin parpadeo). — ✅ `app/layout.tsx:6-14`; en vivo `document.fonts.check` → `true` para ambas, h1 `Fredoka, "Fredoka Fallback"`, body `Nunito, "Nunito Fallback"`.
- [x] Ningún enlace navega: todos los `<a>` de la página son `href="#"`. — ✅ 15/15 anchors con `href="#"` en el DOM (composer, logo, CTA, 4 nav, logout, 3×[foto, comentarios, editar]); sin `next/link` en `app/`.
- [x] La imagen placeholder del post ACTIVIDAD es el recuadro punteado `#DBCDBA` del mockup, no una imagen real. — ✅ Computado: `border dashed rgb(219,205,186)` + bg `rgb(244,236,225)` (`#DBCDBA`/`#F4ECE1`), SVG + copy, sin `<img>`.
- [x] Con ancho < 768px el sidebar se convierte en drawer accesible por hamburguesa y el feed ocupa todo el ancho. — ✅ Verificado en vivo a 500px: cerrado `translate: -100%` (off-screen), hamburguesa abre (`translate: 0px`, 248px, `aria-expanded=true`), Escape cierra (`aria-expanded=false`); capturas `.playwright-mcp/spec01-drawer-closed.png` y `spec01-drawer-open.png`.
- [x] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan sin errores. — ✅ Los tres ejecutados sin warnings ni errores (build: ruta `/` prerenderizada estática).
- [x] La captura guardada en `.playwright-mcp/feed.png` a ~1200px es visualmente equivalente a `references/screenshots/feed.png`. — ✅ 1200×800, equivalencia lado a lado (layout, copy, pills, gradiente, fuentes). Única divergencia: el corazón sale relleno siguiendo el HTML del mockup (fuente de verdad, `feed.dc.html:71` con `fill="#E0654A"`), mientras la captura de referencia lo muestra hueco; lo mismo ocurre con la inicial "C" del composer ("c" en la captura). El HTML manda.

## Decisions

- Sí: módulo mock `lib/mock-posts.ts` separado del render. Los próximos specs (detalle, crear) reutilizan la forma del post y migrar a BD será reemplazar el archivo.
- No: hardcodear JSX de posts en `page.tsx`. Duplicaría estructura que las pantallas futuras necesitarán como componente.
- Sí: enlaces `href="#"`. Decisión del usuario: no apuntar a rutas inexistentes por ahora.
- Sí: copy 100% estático. La fecha "martes 17 jun" es literal (decisión del usuario).
- No: rutas stub para el resto de pantallas. Fuera del alcance de este spec.
- Sí: drawer con hamburguesa en móvil. Es la única UI añadida que no está en el mockup.
- Sí: `next/font/google` en lugar del `<link>` de Google Fonts del mockup; mismas fuentes, auto-alojadas sin parpadeo.
- Sí: verificación por captura visual, no diff de píxeles.

## Risks

| Risk | Mitigation |
| --- | --- |
| La captura nunca será píxel-idéntica (antialiasing de fuentes, DPI) | Criterio de equivalencia lado a lado contra `feed.png`; sin diff automático |
| El drawer inventado puede verse fuera del design system | Reutiliza los estilos/tokens del sidebar desktop ya implementado |

## What is **not** in this spec

- Todas las pantallas distintas de `/`.
- Autenticación, roles, base de datos.
- Persistencia e interacción real (likes, comentarios, edición).
- Vista familia (`familia-*`).
