# SPEC 02 — Listado de niños y perfil (`/children`)

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-11
> **Objetivo:** Reproducir en `/children` y `/children/[childId]` las pantallas `ninos.dc.html` y `perfil-nino.dc.html` con datos mock y navegación real entre ambas, sin base de datos y con rutas en inglés.

## Scope

**In:**

- Listado en `/children`: eyebrow "GESTIÓN", título "Niños", CTA "Agregar niño", buscador decorativo, divisor "SALA SOLES · 8 niños" y grid de 8 tarjetas (avatar con inicial, nombre, edad + padres vinculados, pill o chevron).
- Perfil dinámico en `/children/[childId]`: back "Volver a Niños", avatar 84px, "Editar", alerta de alergias condicional, ficha (nacimiento / sala / ingreso), CTA "Resumen del día" y tarjeta "PADRES VINCULADOS" con pills ACTIVA/PENDIENTE y "Vincular otro padre".
- Mock de los 8 niños en `lib/mock-children.ts` (Mateo fiel al mockup; los otros 7 con datos inventados coherentes).
- Sidebar: `next/link` a `/` y `/children` con estado activo por ruta (`usePathname`).
- Tokens nuevos de color en `@theme` (paleta de avatares, badges, alerta, chevron) y hover de tarjeta del mockup.
- Degradación simple: grid a 1 columna bajo 640px (el drawer del sidebar ya existe).

**Out of scope (para futuros specs):**

- Pantallas Agregar niño / Resumen del día / Vincular padre / Avisos / Mi cuenta / Nueva publicación / Login.
- Base de datos, autenticación y roles.
- Filtrado real del buscador; interactividad (editar, vincular, desvincular).
- Vista familia (`familia-*`).

## Data model

```ts
// lib/mock-children.ts
export type Badge = { label: string; kind: "alergia" | "invitar" }; // MANÍ/LACTOSA | VINCULAR

export type MockParent = {
  fullName: string; // "Lucía Fernández"
  meta: string; // "Mamá · activa" | "Papá · invitación enviada"
  status: "activa" | "pendiente";
  avatarBg: string; // "#C9B6E8"
  avatarFg: string; // "#FFFFFF"
};

export type MockChild = {
  id: string; // slug de URL: "mateo-fernandez"
  fullName: string; // "Mateo Fernández"
  age: string; // "3 años"
  linkedParents: string; // "2 padres vinculados" | "sin padres vinculados"
  badge: Badge | null; // null → chevron
  avatarBg: string; // paleta del mockup, 5 combinaciones
  avatarFg: string;
  room: string; // "Soles"
  birthDate: string; // "12 mar 2022" (Mateo, exacto)
  intakeDate: string; // "feb 2025"
  allergyNote: string | null; // null → sin alerta en el perfil
  parents: MockParent[]; // [] → solo "Vincular otro padre"
};
```

`MOCK_CHILDREN: MockChild[]` con los 8 del mockup. Los badges y counts de padres respetan las tarjetas; perfiles completos solo existen como datos mock.

## Implementation plan

> Antes de escribir código: leer en `node_modules/next/dist/docs/` la guía de dynamic routes de Next 16 (`params` es una Promise; con `cacheComponents` activo usar `generateStaticParams` para los 8 ids).

1. `lib/mock-children.ts`: tipos + 8 niños. Manual: compila.
2. `app/globals.css`: tokens nuevos en `@theme` (avatares, badges MANÍ `#FBD8CC`/`#D9684A`, VINCULAR `#F9D2DE`/`#C56486`, PENDIENTE `#F7E7A6`/`#9A7B1E`, alerta `#FBDAD6`/`#F4A8A0`/`#C5413A`/`#B25249`, chevron `#CBB89F`). Manual: compila.
3. `app/_components/app-sidebar.tsx`: `NAV_ITEMS` pasa a `{ label, href, activeOn, icon }` con `Link`; `usePathname` decide el activo. Manual: en `/` activa Feed y en `/children` activa Niños.
4. `app/children/page.tsx`: listado completo con grid `grid-cols-2 max-sm:grid-cols-1`; tarjetas `Link` con hover (`border-[#F2A78E]` + `-translate-y-0.5`, `transition .15s`). Manual: `/children` replica `ninos.dc.html`.
5. `app/children/[childId]/page.tsx`: perfil con `await params`, `generateStaticParams` desde el mock y `notFound()` para id desconocido. Manual: cada tarjeta abre el perfil de ese niño y `/children/xyz` da 404.
6. Verificación final: `npm run lint`, `npx tsc --noEmit`, `npm run build` y capturas Playwright en `.playwright-mcp/`.

## Acceptance criteria

- [x] `/children` muestra el copy exacto del mockup: "GESTIÓN", "Niños", "Agregar niño", "Buscar niño…", "SALA SOLES", "8 niños" y los 8 nombres con su edad y texto de padres vinculados. — ✅ DOM en vivo (`:3000/children`): eyebrow "GESTIÓN" (`app/children/page.tsx:56`), "Niños", CTA "Agregar niño" (`:69`), placeholder "Buscar niño…" (`:83`), "SALA SOLES" + "8 niños" (`:91,96`); los 8 nombres/edades/copys en `lib/mock-children.ts:32,61,83,112,126,148,170,192` copian `ninos.dc.html`; captura `.playwright-mcp/ninos.png`.
- [x] Los badges coinciden niño a niño: MANÍ (Mateo) y LACTOSA (Tomás) en `#FBD8CC`/`#D9684A`, VINCULAR (Valentina) en `#F9D2DE`/`#C56486`, y chevron `#CBB89F` en el resto. — ✅ Computado en vivo: MANÍ y LACTOSA `rgb(251,216,204)`/`rgb(217,104,74)`, VINCULAR `rgb(249,210,222)`/`rgb(197,100,134)`, chevron `rgb(203,184,159)` en Sofía/Benjamín/Emma/Lucas/Olivia; colores por `badge.kind` en `app/children/page.tsx:34-46`.
- [x] Cada tarjeta navega a `/children/<id>` (rutas 100% en inglés) y el perfil muestra el nombre y datos de ese niño. — ✅ DOM: 8 hrefs `/children/<slug>` kebab sin tildes; clic en la tarjeta de Sofía → `/children/sofia-mendez` con h1 "Sofía Méndez"; `Link href={/children/${child.id}}` en `app/children/page.tsx:14-19`.
- [x] `/children/mateo-fernandez` replica `perfil-nino.dc.html`: "Volver a Niños", "3 años · Sala Soles", "Editar", alerta de alergia con su texto exacto, ficha "12 mar 2022 / Soles / feb 2025", CTA "Resumen del día", Lucía (ACTIVA `#CFEBD8`/`#3E9B6C`), Diego (PENDIENTE `#F7E7A6`/`#9A7B1E`) y "Vincular otro padre". — ✅ DOM en vivo: todo el copy coincide; ACTIVA `rgb(207,235,216)`/`rgb(62,155,108)`, PENDIENTE `rgb(247,231,166)`/`rgb(154,123,30)`; captura `.playwright-mcp/perfil-nino.png` equivalente al render de `perfil-nino.dc.html` (`.playwright-mcp/ref-perfil-nino.png`).
- [x] Un `childId` inexistente muestra la página 404. — ✅ `/children/no-existe` en vivo → título "404: This page could not be found." con HTTP 404; `notFound()` en `app/children/[childId]/page.tsx:53` tras `await params` (`:51`); recomendación vigente confirmada con Context7 (`/vercel/next.js/v16.4.5`, `not-found.mdx`).
- [x] El estado activo del sidebar sigue la ruta: "Niños" en `/children` y "Feed" en `/`; logo, CTA, Avisos, Mi cuenta y logout siguen `href="#"`. — ✅ En vivo: en `/children` y el perfil queda "Niños" activo y en `/` "Feed" (clases `bg-clay-soft` evaluadas); logo, CTA, Avisos, Mi cuenta y logout con `href="#"` en el DOM; patrón `usePathname` + `Link` confirmado con Context7 (`link.mdx`/`layout.mdx` v16.4.5); código `app/_components/app-sidebar.tsx:56,134-140`.
- [x] "Volver a Niños" regresa a `/children`. — ✅ Test de navegación: desde `/children/sofia-mendez`, clic en "Volver a Niños" → `waitForURL("**/children")` ok; `Link href="/children"` en `app/children/[childId]/page.tsx:47-52`.
- [x] "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" son `href="#"`. — ✅ DOM + grep: `app/children/page.tsx:63`, `app/children/[childId]/page.tsx:87` (Editar), `:125` (Resumen del día), `:143` (Vincular otro padre); en el listado, logo/CTA/nav sin destino completan el patrón de SPEC 01.
- [x] El buscador es un input decorativo sin lógica de filtrado. — ✅ `app/children/page.tsx:80-86`: `<input>` sin `value`, `onChange` ni handlers, y el archivo no usa `useState`; en vivo renderiza solo el placeholder "Buscar niño…".
- [x] Bajo 640px el grid pasa a 1 columna. — ✅ A 500px: `gridTemplateColumns: 468px` (1 columna), drawer cerrado (aside en x=-248) y topbar visible; clase `max-sm:grid-cols-1` en `app/children/page.tsx:100`; captura `.playwright-mcp/ninos-mobile.png`.
- [x] El hover de tarjeta aplica borde `#F2A78E`, desplazamiento -2px y transición .15s. — ✅ Computado en hover: `borderColor: rgb(242,167,142)`, `translate: 0px -2px` (propiedad `translate` de Tailwind 4, equivalente visual al `translateY(-2px)` del mockup), `transitionDuration: 0.15s`; clases en `app/children/page.tsx:18`.
- [x] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan sin errores. — ✅ Los tres ejecutados en limpio: lint sin warnings, `tsc` OK, build con 14/14 páginas (`/children` estática; shell PPR de `/children/[childId]` con los 8 ids prerenderizados vía `generateStaticParams`, `:7-9`).
- [x] Capturas en `.playwright-mcp/ninos.png` y `.playwright-mcp/perfil-nino.png` equivalentes lado a lado a `ninos2.png` y al render de `perfil-nino.dc.html`. — ✅ 1200×800 contra el dev server: equivalencia lado a lado en ambas; en el listado el sidebar muestra "Niños" activo como manda `ninos.dc.html` (divergencia ya documentada en Risks respecto a `ninos2.png`); el overlay "N" de las capturas son las dev tools, no UI de la app.

## Decisions

- **Sí:** rutas `/children` y `/children/[childId]` con slugs kebab (`mateo-fernandez`). Decisión del usuario: nombres de ruta siempre en inglés.
- **Sí:** mock dinámico de 8 niños; los 7 perfiles que el mockup no detalla llevan fechas/notas/padres inventados coherentes. Mateo es copia literal.
- **Sí:** sidebar con `next/link` + `usePathname` para el activo. Es la navegación real del producto; el resto de destinos queda `href="#"` (convención de SPEC 01).
- **No:** hardcodear el perfil de Mateo en una ruta fija. Repetiría el layout 8 veces o rompería la navegación tarjeta→perfil.
- **No:** rutas stub para Avisos / Mi cuenta / Agregar niño / Resumen del día / Vincular padre. Fuera de alcance.
- **Sí:** buscador decorativo. "Únicamente diseño" (decisión del usuario).
- **Sí:** grid a 1 columna bajo 640px (decisión del usuario), única degradación añadida; el drawer ya existe.
- **Sí:** tokens nuevos en `@theme` siguiendo la convención de SPEC 01 en vez de valores arbitrarios inline.

## Risks

| Risk | Mitigation |
| --- | --- |
| Los datos inventados de los 7 niños pueden contradecir una futura BD | Están aislados en `lib/mock-children.ts`; migrar = reemplazar el archivo |
| `ninos2.png` muestra "Feed" como activo (captura previa al mockup final) | Fuente de verdad: `ninos.dc.html`; la divergencia queda documentada en el criterio de captura |

## What is **not** in this spec

- Agregar niño, Resumen del día, Vincular padre, Avisos, Mi cuenta, Nueva publicación y Login.
- Base de datos, autenticación, roles y filtrado real.
- Vista familia (`familia-*`).
