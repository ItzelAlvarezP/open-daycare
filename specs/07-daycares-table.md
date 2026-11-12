# SPEC 07 — Tabla `daycares` (primera migración de BD)

> **Estado:** Implementado
> **Depende de:** — (primera spec de base de datos)
> **Fecha:** 2026-11-12
> **Objetivo:** Crear la tabla raíz `daycares` en Supabase vía migración MCP (DDL + RLS + seed de 4 guarderías), siguiendo el doc de referencia `../07-DB-Schema/opendaycare-database-schema.md`.

## Scope

**In:**

- Una única migración aplicada con `apply_migration` del MCP de Supabase contra el proyecto `rqvennwvmfjsuvjqwnim`, registrada en `supabase_migrations.schema_migrations`.
- Tabla `public.daycares`: `id uuid` PK default `gen_random_uuid()`, `name text NOT NULL`, `address text` nullable, `created_at timestamptz NOT NULL default now()`.
- `ENABLE ROW LEVEL SECURITY` + política SELECT para el rol `authenticated`.
- Seed en la misma migración: 4 guarderías — «Guardería Sala Soles», «Guardería Estrellitas», «Guardería Jardín Mágico», «Guardería Pequeños Genios».
- Verificación de todo mediante herramientas MCP (`list_migrations`, `execute_sql`, `list_tables`).

**Out of scope (para futuros specs):**

- El resto de tablas del doc (`users`, `rooms`, `children`, `parent_children`, `invitations`, `posts`, `post_children`, `post_photos`, `reactions`, `comments`, `daily_summaries`, `devices`) y los ENUMs — cada tabla en su propio spec.
- Políticas RLS de escritura (INSERT/UPDATE/DELETE) o para `anon`.
- Cliente `supabase-js` en la app Next.js, consumo de la tabla desde UI.
- `updated_at` y triggers.

## Data model

SQL completo que se envió a `apply_migration`, versionado en `supabase/migrations/20261112201811_create_daycares_table.sql`:

```sql
create table public.daycares (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;

create policy "daycares_select_authenticated"
  on public.daycares
  for select
  to authenticated
  using (true);

insert into public.daycares (name) values
  ('Guardería Sala Soles'),
  ('Guardería Estrellitas'),
  ('Guardería Jardín Mágico'),
  ('Guardería Pequeños Genios');
```

Convenciones del doc: PK uuid, `created_at timestamptz`, persistido en inglés (`address`), etiquetas visibles traducidas en UI.

## Implementation plan

1. Estado previo: `list_migrations` + `execute_sql` sobre `pg_tables` para confirmar que `public.daycares` no existe y anotar qué migraciones hay. Manual: reporte del estado actual.
2. `apply_migration("create_daycares_table", <SQL del data model>)`. Manual: la herramienta confirma aplicación exitosa.
3. Verificación inmediata con `execute_sql`: `select * from daycares` (4 filas), `select * from pg_policies where tablename = 'daycares'`. El checklist completo queda en Acceptance criteria.

## Acceptance criteria

- [x] `list_migrations` muestra la migración `create_daycares_table` aplicada. — Evidencia: `20261112201811 create_daycares_table`.
- [x] `list_tables` / `information_schema.columns` confirman la tabla con exactamente las columnas `id`, `name`, `address`, `created_at` y sus tipos/default/nullable según el data model. — Evidencia: `id` uuid NOT NULL default `gen_random_uuid()` (PK), `name` text NOT NULL sin default, `address` text nullable, `created_at` timestamptz NOT NULL default `now()`; `list_tables` verbose: PK `id`, `rls_enabled: true`, 4 filas.
- [x] `select * from public.daycares` devuelve exactamente 4 filas con los nombres del seed, incluida «Guardería Sala Soles». — Evidencia: Estrellitas, Jardín Mágico, Pequeños Genios y Sala Soles; `address` null, `created_at` `2026-11-12 20:18:11.722809+00`.
- [x] `insert into public.daycares (id) values (gen_random_uuid())` dentro de una transacción con `rollback` falla por `name` NOT NULL. — Evidencia: error `23502: null value in column "name" of relation "daycares" violates not-null constraint`; `count(*) = 4` tras el rollback.
- [x] `relrowsecurity = true` en `pg_class` y `pg_policies` contiene la política SELECT `to authenticated`. — Evidencia: `relrowsecurity = true`; política `daycares_select_authenticated`, cmd `SELECT`, roles `{authenticated}`, qual `true`.
- [x] Con `set local role anon`, un `select count(*) from public.daycares` devuelve 0 (RLS bloquea al anónimo). — Evidencia: `set local role anon` → `count(*) = 0`.

## Decisions

- **Sí:** solo MCP para aplicar la migración (sin CLI). Decisión del usuario. **Actualización 2026-11-12:** el usuario pidió versionar también el SQL en el repo; el fichero vive en `supabase/migrations/20261112201811_create_daycares_table.sql`.
- **Sí:** RLS habilitada + policy SELECT para `authenticated`. Predeterminado seguro; escritura se añadirá en specs con auth.
- **Sí:** seed de 4 guarderías en la misma migración (decisión del usuario). Aún no hay UI que las cree y los specs futuros (`rooms`, `children`, `users`) necesitan el FK.
- **Sí:** columna extra `address text` nullable sobre lo que dice el doc, a petición del usuario; en inglés por la convención de idioma del doc.
- **No:** `updated_at`: la definición de `daycares` del doc solo lista `created_at` y `name` no se edita en la app.
- **No:** instalar la CLI de Supabase (el fichero de migración vive en `supabase/migrations/` sin CLI).

## Risks

| Risk | Mitigation |
| --- | --- |
| Reconstruir el esquema si se pierde el proyecto remoto | El SQL completo vive en este spec, en `supabase/migrations/20261112201811_create_daycares_table.sql` y en `supabase_migrations.schema_migrations` |
| Un spec futuro intente leer `daycares` con la clave publishable desde el navegador y RLS lo bloquee | Ese spec añade su policy; con `service_role` (server-side) no hay problema |

## What is **not** in this spec

- Cualquier otra tabla, enum, política de escritura o bucket de storage.
- Integración con la app Next.js (cliente, fetching, UI).
