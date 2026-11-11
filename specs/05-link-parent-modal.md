# SPEC 05 — Modal Vincular padre (`/children/[childId]`)

> **Estado:** Aprobado
> **Depende de:** SPEC 02
> **Fecha:** 2026-11-11
> **Objetivo:** Reproducir `references/pantallas/vincular-padre.dc.html` como un modal en el perfil del niño, abierto desde «Vincular otro padre», con validación visual de nombre y email pero sin enviar ni guardar invitaciones.

## Scope

**In:**

- Modal superpuesto al perfil, sin cambiar la URL, basado en `vincular-padre.dc.html`: tarjeta `#FBF4EC`, ancho máximo 480px, radio 24px, borde `#ECE0D0` y sombra del mockup.
- Header «Vincular padre» y subtítulo dinámico «a {nombre del niño activo}»; botón X cierra el modal.
- Aviso informativo con el texto del mockup, usando el nombre dinámico: «Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {nombre del niño activo}.»
- Campos NOMBRE DEL PADRE/MADRE y EMAIL con placeholders «Ej. Diego Fernández» y «correo@ejemplo.com».
- Selector visual de parentesco con «Mamá», «Papá» y «Tutor/a»; «Mamá» aparece seleccionado inicialmente y la selección puede cambiarse.
- Bloque visual CÓDIGO DE INVITACIÓN con código estático `7K4P9` y texto «Vence en 7 días».
- CTA «Enviar invitación» valida que nombre y email no estén vacíos y que el email tenga formato válido. Los errores se muestran inline con estilo de la app; escribir en un campo con error limpia su error.
- Si ambos campos son válidos, el CTA cierra el modal sin enviar invitación ni guardar datos.
- Cierre mediante X, clic en el backdrop o tecla Esc, sin validar. Al reabrir, los campos y errores se reinician.
- Bloquear el scroll de fondo mientras el modal está abierto y restaurarlo al cerrar.
- Adaptación a pantallas pequeñas para que la tarjeta use el ancho disponible con margen de 24px y pueda desplazarse verticalmente si no cabe.

**Out of scope (para futuros specs):**

- Envío de correos, generación o expiración real de códigos y activación de cuentas.
- Persistencia, base de datos, vinculación del padre o modificación de `MOCK_CHILDREN`.
- Detección de emails duplicados, validaciones adicionales o backend.
- Cambios a otras acciones del perfil («Editar» y «Resumen del día»), listado de niños o vista familia.

## Data model

Este spec no introduce datos persistentes ni estructuras de dominio nuevas. El estado local del modal incluye apertura, parentesco seleccionado y errores de los campos:

```ts
type FormErrors = {
  fullName?: string;
  email?: string;
};
```

El nombre del niño se obtiene del `MockChild` ya usado por la ruta dinámica del perfil. El código `7K4P9` es contenido estático de presentación.

## Implementation plan

> Antes de escribir código: leer en `node_modules/next/dist/docs/` la guía vigente de Client Components e interactividad para Next.js 16.

1. Revisar los componentes y tokens existentes del perfil y del modal de SPEC 04; identificar qué estilos pueden reutilizarse sin alterar otras pantallas. Manual: lint y typecheck siguen pasando.
2. Crear `app/_components/link-parent-modal.tsx` como componente cliente, recibiendo el nombre del niño y mostrando la tarjeta, header, aviso, campos, parentesco, código y CTA conforme al mockup. Manual: el modal renderiza el nombre recibido y el contenido especificado.
3. Añadir apertura desde «Vincular otro padre» en `app/(app)/children/[childId]/page.tsx`, conservando la ruta y el resto del perfil. Implementar cierre por X, backdrop y Esc, reinicio al reabrir y bloqueo/restauración del scroll. Manual: abrir y cerrar por cada vía no navega fuera del perfil.
4. Implementar validación inline de nombre y email, selección de parentesco y cierre del CTA cuando los campos sean válidos. Manual: campos vacíos y email mal formado presentan errores; corregirlos limpia los errores y permite cerrar sin modificar datos del perfil.
5. Ajustar el comportamiento responsive y verificar `npm run lint`, `npx tsc --noEmit`, `npm run build` y capturas Playwright guardadas en `.playwright-mcp/`, comparadas con el mockup.

## Acceptance criteria

- [ ] En cualquier `/children/[childId]`, pulsar «Vincular otro padre» abre el modal sobre el perfil sin cambiar la URL.
- [ ] El modal reproduce la estructura, copy, colores, tipografía, bordes y sombras de `references/pantallas/vincular-padre.dc.html`.
- [ ] El encabezado y el aviso muestran el nombre del niño del perfil activo, no un nombre fijo.
- [ ] Se muestran los dos campos con labels y placeholders especificados, y las tres opciones de parentesco con «Mamá» seleccionada inicialmente.
- [ ] El código mostrado es `7K4P9` y el vencimiento dice «Vence en 7 días».
- [ ] Enviar con nombre o email vacío mantiene abierto el modal y muestra el error correspondiente inline.
- [ ] Enviar con email de formato inválido mantiene abierto el modal y muestra un error inline en email.
- [ ] Corregir un campo con error elimina su mensaje y borde de error.
- [ ] Enviar con nombre y email válidos cierra el modal; no crea ni modifica padres, invitaciones o datos persistentes.
- [ ] X, clic en backdrop y Esc cierran sin validar; al reabrir, nombre y email están vacíos, «Mamá» seleccionada y sin errores.
- [ ] El scroll del fondo queda bloqueado mientras el modal está abierto y se restaura al cerrarlo.
- [ ] En viewport estrecho, la tarjeta mantiene 24px de margen lateral y el contenido puede desplazarse sin quedar cortado.
- [ ] «Editar», «Resumen del día» y el resto del perfil mantienen su comportamiento y presentación actuales.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan correctamente.
- [ ] Las capturas de verificación se guardan bajo `.playwright-mcp/` y muestran el modal en desktop y viewport estrecho.

## Decisions

- **Sí:** el modal toma el nombre del niño desde el perfil activo. El componente se usa en rutas dinámicas y no debe presentar datos incorrectos en otros perfiles.
- **Sí:** validar nombre requerido y formato de email con errores inline; es el comportamiento aceptado para esta UI sin backend.
- **Sí:** un envío válido cierra el modal sin persistir ni transmitir datos. Esto mantiene el alcance de diseño y evita simular una invitación efectiva.
- **Sí:** el código y su vencimiento son estáticos, como en el mockup; no representan una invitación real.
- **Sí:** el selector de parentesco es interactivo localmente, pero no se conserva tras cerrar ni se guarda.
- **No:** añadir confirmación de éxito o estado de invitación enviada, porque implicaría representar una acción que no ocurre.

## What is **not** in this spec

- Enviar invitaciones, generar códigos reales, mandar correos o activar cuentas.
- Guardar o vincular padres, modificar datos mock, persistir información o añadir backend.
- Implementar otras acciones del perfil o pantallas de familia.
