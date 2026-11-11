# SPEC 04 — Modal Agregar niño (`/children`)

> **Estado:** Implementado
> **Depende de:** SPEC 02, SPEC 03
> **Fecha:** 2026-11-11
> **Objetivo:** Reproducir `agregar-nino.dc.html` como un modal sobre `/children` que se abre desde el CTA "Agregar niño" y valida como requeridos sus tres primeros campos al pulsar Guardar.

## Scope

**In:**

- Modal de overlay sobre `/children` (sin cambiar de URL): backdrop oscuro + tarjeta `#FBF4EC` de 520px con radio 24px, borde `#ECE0D0` y sombra `0 20px 50px -24px rgba(63,54,46,.35)`, centrada en el viewport.
- Header del modal con el copy exacto del mockup: "Cancelar" (`#94887B`, 15px, bold) a la izquierda, "Agregar niño" (Fredoka 600, 18px) al centro y "Guardar" (`#D9583C`, 15px, extrabold) a la derecha.
- Cinco campos con labels y placeholders exactos: NOMBRE COMPLETO ("Ej. Martina López"), FECHA DE NACIMIENTO ("dd/mm/aaaa") y SALA en la misma fila (grid 2 columnas), ALERGIAS (ETIQUETAS) ("Ej. Maní, Lactosa") y NOTAS MÉDICAS ("Indicaciones, medicación, contactos…", textarea min-height 90px).
- CTA "Agregar niño" del listado deja de ser `href="#"` y abre el modal.
- Campos requeridos: los tres primeros (nombre, fecha, sala). ALERGIAS y NOTAS son opcionales.
- Validación al pulsar Guardar: errores inline estilo app (texto `clay-dark` bajo el campo + borde `clay` en el input); Guardar solo cierra si todo es válido.
- FECHA DE NACIMIENTO: input de texto con validación de formato `dd/mm/aaaa` y de fecha real (p. ej. `31/02/2024` falla).
- SALA: `<select>` real estilizado con la única opción "Soles" preseleccionada y chevron decorativo `#B0A290`.
- Cierre sin confirmación y sin validar: botón Cancelar, clic en backdrop y tecla Esc. Al abrir se bloquea el scroll de fondo; al cerrar, el formulario vuelve vacío.
- Inputs uncontrolled (convención de SPEC 03); `/children` sigue siendo server component.
- Tokens nuevos en `@theme`: `--radius-modal: 24px`, `--shadow-modal`, `--color-backdrop`.
- Degradación: bajo 640px la tarjeta pasa a ancho completo con márgenes de 24px y altura scrollable.

**Out of scope (para futuros specs):**

- Agregar el niño al grid ni al mock: Guardar valida y cierra, la lista queda estática ("8 niños").
- Persistencia, base de datos y envío real de los datos del formulario.
- Perfil del niño creado y su tarjeta en el listado.
- Los demás CTAs de SPEC 02 (Editar, Resumen del día, Vincular otro padre) siguen `href="#"`; el buscador sigue decorativo.
- Vista familia (`familia-*`).

## Data model

Este spec no introduce datos mock ni estructuras nuevas. El único estado es UI local del client component:

```ts
// app/_components/add-child-modal.tsx ("use client")
const [open, setOpen] = useState(false);
const [errors, setErrors] = useState<{ fullName?: boolean; birthDate?: boolean } | null>(null);
// room es <select> preseleccionado en "Soles": siempre válido, el error queda definido por simetría
```

El form se desmonta al cerrar (render condicional), así los inputs uncontrolled se resetean solos.

## Implementation plan

> Antes de escribir código: leer en `node_modules/next/dist/docs/` la guía de client components (`use client`) y confirmar que el render condicional del modal no afecta al prerender de `/children`.

1. `app/globals.css`: tokens nuevos en `@theme` — `--radius-modal: 24px`, `--shadow-modal: 0 20px 50px -24px rgb(63 54 46 / 0.35)`, `--color-backdrop: rgb(63 54 46 / 0.4)`. Reutiliza los existentes: `auth-bg` (tarjeta), `auth-border` (inputs), `line` (borde de tarjeta), `muted-dark` (labels y Cancelar), `clay-dark` (Guardar y mensajes de error), `clay` (borde de error), `placeholder`, `photo-text` (chevron), `radius-cta` (inputs de 14px). Manual: compila.
2. `app/_components/add-child-modal.tsx`: client component `AddChildButton` con el botón CTA (mismo estilo del `<a>` actual) y el modal: backdrop `fixed` + tarjeta, header con Cancelar/Título/Guardar, cierre por Cancelar, backdrop y Esc (`useEffect` con `keydown`), bloqueo del scroll de fondo al abrir. Guardar aún sin validación: cierra. Manual: `/children` muestra el CTA y abre/cierra el modal por las tres vías.
3. Formulario completo en el modal: los 5 campos con copy y placeholders exactos, `<select>` de Sala con "Soles" y chevron, y validación de Guardar — requeridos vacíos o fecha inválida muestran errores inline y el modal permanece abierto; escribir en un campo limpia su error; con todo válido Guardar cierra. Manual: Guardar vacío marca los 3 requeridos; una fecha válida y los campos llenos cierran el modal.
4. `app/(app)/children/page.tsx`: reemplazar el `<a href="#">` del header por `<AddChildButton />`. Manual: el CTA del listado abre el modal y el resto de la página queda idéntica.
5. Responsive: bajo 640px tarjeta a ancho completo con márgenes de 24px, `overflow-y: auto` si la altura no alcanza, y el backdrop sigue cubriendo todo. Manual: a 500px el modal es completo y usable.
6. Verificación final: `npm run lint`, `npx tsc --noEmit`, `npm run build` y capturas Playwright en `.playwright-mcp/` (`agregar-nino.png` desktop, estado de error y móvil) comparadas lado a lado contra `agregar-nino.dc.html` renderizado.

## Acceptance criteria

- [x] El CTA "Agregar niño" de `/children` abre el modal sobre la página (backdrop + tarjeta centrada) sin cambiar de URL. — ✅ Playwright: abrió el modal y `location.pathname` permaneció en `/children`; `.playwright-mcp/agregar-nino.png`.
- [x] La tarjeta replica el mockup: fondo `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra del mockup, header con "Cancelar" `#94887B` / "Agregar niño" en Fredoka / "Guardar" `#D9583C`. — ✅ Estilos computados en vivo: fondo `rgb(251,244,236)`, borde `rgb(236,224,208)`, radio `24px`, sombra `0 20px 50px -24px`, ancho `520px`; header: Cancelar `rgb(148,136,123)`/700, Fredoka 600/18px, Guardar `rgb(217,88,60)`/800. Captura `.playwright-mcp/agregar-nino.png` comparada visualmente con `.playwright-mcp/agregar-nino-mockup.png`.
- [x] Los cinco campos muestran el copy exacto: labels "NOMBRE COMPLETO", "FECHA DE NACIMIENTO", "SALA", "ALERGIAS (ETIQUETAS)", "NOTAS MÉDICAS" y placeholders "Ej. Martina López", "dd/mm/aaaa", "Ej. Maní, Lactosa", "Indicaciones, medicación, contactos…". — ✅ Labels y placeholders evaluados en el DOM; captura `.playwright-mcp/agregar-nino.png`.
- [x] FECHA DE NACIMIENTO y SALA comparten fila (2 columnas) como en el mockup. — ✅ Captura `.playwright-mcp/agregar-nino.png` comparada con el mockup.
- [x] SALA es un `<select>` con la única opción "Soles" preseleccionada y chevron decorativo. — ✅ DOM: `select.value === "Soles"`, única opción `Soles`; chevron SVG decorativo en el campo.
- [x] Guardar con los requeridos vacíos muestra errores inline (texto terracota + borde de error) bajo nombre y fecha, y el modal permanece abierto; SALA llega preseleccionada en "Soles" y por diseño no puede quedar vacía, así que nunca marca error. — ✅ Playwright: modal permanece abierto; dos mensajes `Completá este campo.` en `rgb(217,88,60)`, bordes `rgb(224,101,74)`; SALA conserva `Soles` y borde normal. Captura `.playwright-mcp/agregar-nino-errores.png`.
- [x] Guardar con una fecha en formato inválido o imposible (p. ej. "abc", "31/02/2024") muestra su error inline; con "dd/mm/aaaa" válida no lo muestra. — ✅ Playwright: `31/02/2024` muestra `Usá el formato dd/mm/aaaa.`; `12/03/2022` no muestra error y restaura el borde normal.
- [x] Escribir en un campo con error limpia ese error al momento. — ✅ Playwright: al escribir nombre válido, desapareció su mensaje y el borde volvió a `rgb(234,223,208)`; lo mismo al corregir la fecha.
- [x] Guardar con los 3 requeridos válidos cierra el modal; la lista no cambia y el divisor sigue "8 niños". — ✅ Playwright: modal cerrado, URL `/children`, divisor `8 niños` y 8 tarjetas tras guardar nombre/fecha con sala preseleccionada.
- [x] ALERGIAS y NOTAS MÉDICAS vacías no bloquean Guardar. — ✅ Playwright: Guardar con ambos opcionales vacíos cerró el modal.
- [x] Cancelar, clic en backdrop y Esc cierran el modal sin confirmación; al reabrir, el formulario vuelve vacío. — ✅ Playwright verificó los tres cierres; al reabrir, nombre, fecha, alergias y notas vacíos, sala `Soles` y cero errores.
- [x] Al abrir el modal no se puede hacer scroll de la página de fondo. — ✅ `document.body.style.overflow === "hidden"` abierto y restaurado a `""` al cerrar.
- [x] `/children` no cambia en lo demás: buscador decorativo, divisor, 8 tarjetas y los demás CTAs siguen `href="#"`. — ✅ DOM en vivo: buscador sin handlers, divisor `8 niños`, 8 enlaces de tarjetas; los otros destinos siguen sin navegación.
- [x] Bajo 640px el modal es completo y usable (ancho con márgenes, sin cortes). — ✅ Playwright a 500×800: tarjeta 452px de ancho (24px por lado), sin corte y backdrop con `overflow-y: auto`; captura `.playwright-mcp/agregar-nino-mobile.png`.
- [x] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan sin errores. — ✅ Los tres comandos pasaron; build de Next.js 16.4.6 prerenderizó 16/16 páginas y `/children` quedó estática.
- [x] Capturas `.playwright-mcp/agregar-nino.png` (desktop, estado válido y error) y móvil equivalentes lado a lado al mockup renderizado. — ✅ Capturas `.playwright-mcp/agregar-nino.png`, `agregar-nino-completo.png`, `agregar-nino-errores.png`, `agregar-nino-mobile.png` y `agregar-nino-mockup.png`; comparación visual confirma layout, copy y estilos equivalentes.

## Decisions

- **Sí:** Guardar valida y cierra, sin agregar nada a la lista. Decisión del usuario; mantiene la convención "únicamente diseño" de SPEC 01–03 con validación real como único comportamiento.
- **No:** agregar el niño al grid ni generarle perfil. Los perfiles se prerenderizan desde el mock (`generateStaticParams`), así que un niño nuevo no tendría a dónde navegar; si en el futuro aterriza, su tarjeta será **sin link** (decisión del usuario para ese escenario).
- **Sí:** errores inline estilo app (texto `clay-dark` + borde `clay`). Decisión del usuario; la validación nativa rompe la fidelidad visual.
- **Sí:** fecha como input de texto `dd/mm/aaaa` con validación de formato y de fecha real. Decisión del usuario; `type="date"` pierde el placeholder y la UI del mockup.
- **Sí:** `<select>` real con la única opción "Soles" preseleccionada. Decisión del usuario; deja el camino abierto a más salas. Resolución de la contradicción detectada en implementación: al estar preseleccionada, la sala nunca queda vacía y su validación nunca dispara error (el criterio de aceptación se reescribió en consecuencia).
- **Sí:** Cancelar/backdrop/Esc cierran sin confirmación, con scroll de fondo bloqueado y form que vuelve vacío. Estándar de modales; el desmontaje condicional resetea gratis.
- **Sí:** `AddChildButton` como client component en `app/_components/` (convención del repo); el CTA deja de ser `<a href="#">` y pasa a `<button>`, igual que "Cancelar" y "Guardar" (son acciones, no navegación).
- **Sí:** modal renderizado condicionalmente sin portal: `fixed` cubre el viewport aunque el componente viva dentro del header (sin transforms en ancestros).
- **Sí:** tokens nuevos `radius-modal` / `shadow-modal` / `backdrop` con el naming del design system; `auth-bg`/`auth-border` (SPEC 03) se reutilizan para tarjeta e inputs por ser exactamente los mismos valores.

## Risks

| Risk | Mitigation |
| --- | --- |
| El `fixed` del modal hereda un transform/overflow de algún ancestro y queda mal posicionado | Verificado en el paso 4; si apareciera, migrar a `createPortal` en `document.body` |
| La validación de fecha acepta fechas imposibles si solo se usa regex | Validar fecha real: formato `dd/mm/aaaa` + rangos de día/mes + existencia con `Date` |
| El bloqueo de scroll de fondo puede perder la posición de la página al cerrar | Guardar/restaurar el overflow del body en el mismo `useEffect` del modal |

## What is **not** in this spec

- Agregar el niño al listado, su tarjeta y su perfil.
- Persistencia, base de datos y envío real del formulario.
- Los otros CTAs del listado y del perfil (siguen `href="#"`).
- Vista familia (`familia-*`).
