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

- [ ] `/children` muestra el copy exacto del mockup: "GESTIÓN", "Niños", "Agregar niño", "Buscar niño…", "SALA SOLES", "8 niños" y los 8 nombres con su edad y texto de padres vinculados.
- [ ] Los badges coinciden niño a niño: MANÍ (Mateo) y LACTOSA (Tomás) en `#FBD8CC`/`#D9684A`, VINCULAR (Valentina) en `#F9D2DE`/`#C56486`, y chevron `#CBB89F` en el resto.
- [ ] Cada tarjeta navega a `/children/<id>` (rutas 100% en inglés) y el perfil muestra el nombre y datos de ese niño.
- [ ] `/children/mateo-fernandez` replica `perfil-nino.dc.html`: "Volver a Niños", "3 años · Sala Soles", "Editar", alerta de alergia con su texto exacto, ficha "12 mar 2022 / Soles / feb 2025", CTA "Resumen del día", Lucía (ACTIVA `#CFEBD8`/`#3E9B6C`), Diego (PENDIENTE `#F7E7A6`/`#9A7B1E`) y "Vincular otro padre".
- [ ] Un `childId` inexistente muestra la página 404.
- [ ] El estado activo del sidebar sigue la ruta: "Niños" en `/children` y "Feed" en `/`; logo, CTA, Avisos, Mi cuenta y logout siguen `href="#"`.
- [ ] "Volver a Niños" regresa a `/children`.
- [ ] "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" son `href="#"`.
- [ ] El buscador es un input decorativo sin lógica de filtrado.
- [ ] Bajo 640px el grid pasa a 1 columna.
- [ ] El hover de tarjeta aplica borde `#F2A78E`, desplazamiento -2px y transición .15s.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan sin errores.
- [ ] Capturas en `.playwright-mcp/ninos.png` y `.playwright-mcp/perfil-nino.png` equivalentes lado a lado a `ninos2.png` y al render de `perfil-nino.dc.html`.

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
