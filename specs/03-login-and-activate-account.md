# SPEC 03 — Login y activación de cuenta (`/login`, `/activate-account`)

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-11-11
> **Objetivo:** Reproducir en `/login` y `/activate-account` las pantallas `login.dc.html` y `activar-cuenta.dc.html` sin selector de rol, sin backend ni base de datos, excluyendo el sidebar mediante route groups.

## Scope

**In:**

- Reorganización en route groups: `/` y `/children/**` se mueven a `app/(app)/` junto con el sidebar; `app/layout.tsx` queda solo con fuentes, metadata y `<body>`. URLs intactas.
- `/login`: panel izquierdo con gradiente terracota (logo, claim, "🌿 Guardería Sala Soles", círculos decorativos) y formulario con labels EMAIL/CONTRASEÑA, email precargado, placeholder de contraseña, "¿Olvidaste tu contraseña?", CTA gradiente y footer "¿Te invitó la guardería? Activá tu cuenta".
- `/activate-account`: icono con gradiente, "Bienvenida a OpenDayCare", tarjeta de invitación de Mateo, inputs CÓDIGO DE INVITACIÓN (`7K4P9`) / EMAIL / CREAR CONTRASEÑA, consent box amarillo con check verde y CTA "Activar mi cuenta".
- Inputs uncontrolled con los valores del mockup; contraseñas con placeholder `••••••••`.
- Tokens nuevos de autenticación en `@theme` (`app/globals.css`).
- Degradación simple: el login apila panel y formulario bajo ~768px.

**Out of scope (para futuros specs):**

- Autenticación real: submit, validación, sesión, rutas protegidas.
- Base de datos, invitaciones y permisos; el consentimiento de fotos es solo visual.
- Selector Personal/Familia y las pantallas destino de los CTAs.
- Vista familia (`familia-*`).

## Data model

Este spec no introduce datos nuevos ni mocks. El único estado del mockup (el `loginHref` según rol) desaparece junto con el selector de rol: las dos pantallas son server components estáticos.

## Implementation plan

> Antes de escribir código: leer en `node_modules/next/dist/docs/` la guía de route groups (`01-app/03-api-reference/03-file-conventions/route-groups.md`): mover carpetas no cambia URLs y los grupos permiten layouts por zona.

1. Refactor de grupos: mover `app/page.tsx` a `app/(app)/page.tsx` y `app/children/` a `app/(app)/children/`; crear `app/(app)/layout.tsx` con el wrapper `min-h-dvh md:flex` + `<AppSidebar />`; dejar `app/layout.tsx` sin sidebar. Manual: `/` y `/children/mateo-fernandez` renderizan exactamente igual y el build pasa.
2. `app/globals.css`: bloque nuevo en `@theme` — `--color-auth-bg` `#FBF4EC`, `--color-auth-border` `#EADFD0`, `--color-auth-from` `#F6A98E`, `--color-auth-to` `#EC7E62` (punto medio: reutiliza `avatar-to` `#F2937A`), `--color-kid-avatar` `#A9D9E8`, `--color-kid-avatar-ink` `#1F7A93`, `--color-consent-bg` `#FBF1D6`, `--color-consent-ink` `#8A7234`, `--color-consent-check` `#5FB97E`, `--shadow-auth-cta` `0 10px 22px -8px rgb(238 129 100 / 0.7)`, `--shadow-auth-icon` `0 12px 26px -10px rgb(238 129 100 / 0.65)`. Manual: compila.
3. `app/_components/sun-logo.tsx`: SVG del sol compartido por las dos pantallas (prop `size`). `app/(auth)/login/page.tsx`: panel + formulario completos, sin "INGRESO COMO", inputs con `defaultValue`/`placeholder`, todos los enlaces `href="#"`. Manual: `/login` replica `login.dc.html`.
4. `app/(auth)/activate-account/page.tsx`: pantalla completa con tarjeta de invitación, consent box decorativo marcado y enlaces `href="#"`. Manual: `/activate-account` replica `activar-cuenta.dc.html`.
5. Responsive del login: grid `1.05fr 1fr` → 1 columna bajo `md`, panel compacto (padding y tipografía reducidos) y formulario a ancho completo. Manual: a 500px el login se apila y `/activate-account` es usable.
6. Verificación final: `npm run lint`, `npx tsc --noEmit`, `npm run build` y capturas Playwright en `.playwright-mcp/` (`login.png`, `activate-account.png` y móvil) comparadas lado a lado contra los mockups renderizados.

## Acceptance criteria

- [ ] `/login` muestra el copy exacto del mockup: claim "El día de cada niño, compartido con su familia.", "Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.", "🌿 Guardería Sala Soles", "Iniciar sesión", "Ingresá para ver el día de hoy.", labels EMAIL y CONTRASEÑA, "¿Olvidaste tu contraseña?" y "¿Te invitó la guardería? Activá tu cuenta".
- [ ] `/login` no tiene sección "INGRESO COMO" ni botones Personal/Familia (decisión del usuario).
- [ ] El panel izquierdo usa el gradiente `#F6A98E → #F2937A (45%) → #EC7E62`, dos círculos decorativos `rgba(255,255,255,.12)` y `.10`, y el logo "OpenDayCare" en Fredoka.
- [ ] El input EMAIL llega precargado con `caro@opendaycare.com`, la contraseña muestra el placeholder `••••••••`, ambos con fondo blanco y borde `#EADFD0`.
- [ ] El CTA "Iniciar sesión" usa el gradiente `#F4977E → #EE8164` con sombra `0 10px 22px -8px rgba(238,129,100,.7)`.
- [ ] `/activate-account` replica el mockup: icono con gradiente `#F8C3A8 → #F2937A`, "Bienvenida a OpenDayCare", "Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.", tarjeta con avatar "M" (`#A9D9E8`/`#1F7A93`) y "Mateo · Sala Soles", código `7K4P9` en Fredoka con letter-spacing 3px, email `lucia.fernandez@gmail.com`, consent box `#FBF1D6` con check `#5FB97E` y su texto exacto, CTA "Activar mi cuenta" y footer "¿Ya tenés cuenta? Iniciar sesión".
- [ ] El input CREAR CONTRASEÑA usa borde `#F2A78E` como el HTML del mockup (HTML manda), aunque el campo esté vacío.
- [ ] Todos los `<a>` y botones de las dos pantallas son `href="#"`; ninguno navega.
- [ ] Ni `/login` ni `/activate-account` muestran el sidebar; `/` y `/children` siguen mostrándolo con su estado activo correcto (Feed / Niños).
- [ ] Las URLs de SPEC 01 y 02 quedan intactas tras la reorganización: `/`, `/children` y `/children/[childId]`.
- [ ] A 500px el login se apila (panel compacto arriba, formulario a ancho completo) y `/activate-account` es usable.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan sin errores.
- [ ] Capturas `.playwright-mcp/login.png` y `.playwright-mcp/activate-account.png` a ~1200px equivalentes lado a lado a los mockups renderizados.

## Decisions

- **No:** selector Personal/Familia y su lógica `loginHref`. Decisión del usuario; el login queda sin estado.
- **Sí:** todos los enlaces `href="#"`, incluidos "Activá tu cuenta" e "Iniciar sesión" entre pantallas. Decisión del usuario; convención de SPEC 01.
- **Sí:** route groups `(app)`/`(auth)`. Es la forma idiomática de excluir el sidebar; mover carpetas no cambia URLs.
- **Sí:** inputs uncontrolled con `defaultValue` y páginas 100% server components. "Únicamente diseño" (decisión del usuario).
- **No:** validación, `onSubmit` ni autenticación. Sin backend ni base de datos (decisión del usuario).
- **No:** contraseña de activar con el valor literal `contraseña` del mockup; es un artefacto de demo y se reemplaza por el placeholder `••••••••`.
- **Sí:** borde `#F2A78E` en esa contraseña con el campo vacío. El HTML es la fuente de verdad (criterio de SPEC 01).
- **Sí:** checkbox de consentimiento decorativo y estático, siempre marcado. Mismo criterio que el buscador de SPEC 02.
- **Sí:** apilado del login en móvil (decisión del usuario); única degradación nueva.
- **Sí:** tokens nuevos con el naming del design system; se reutilizan `avatar-from`/`avatar-to`, `kid-hover` (`#F2A78E`), `placeholder`, `clay-deep` y `muted-dark`.

## Risks

| Risk | Mitigation |
| --- | --- |
| La movida a route groups toca specs ya implementados | El paso 1 es solo reorganización con URLs intactas; se re-verifican build y navegación del sidebar |
| Typed routes (`PageProps`/`LayoutProps`) podrían atarse al archivo y no a la URL | Los route groups no cambian la URL; verificarlo en `route-groups.md` antes de mover |

## What is **not** in this spec

- Autenticación, validación y rutas protegidas.
- Base de datos, invitaciones y consentimiento persistido.
- Pantallas destino de los CTAs: "Iniciar sesión" y "Activar mi cuenta" no llevan a ningún lado.
- Vista familia (`familia-*`).
