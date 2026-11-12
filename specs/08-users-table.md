# SPEC 08 — Tabla `users`, enums y alta de usuario staff

> **Estado:** Aprobado
> **Depende de:** SPEC 07 — Tabla `daycares` (necesaria para el FK `users.daycare_id`)
> **Fecha:** 2026-11-12
> **Objetivo:** Crear la tabla `users` con sus enums (`user_role`, `user_status`), el trigger de perfil sobre `auth.users`, RLS por rol/guardería, y dar de alta un usuario staff de prueba vía SQL por MCP, siguiendo el doc de referencia `../07-DB-Schema/opendaycare-database-schema.md`.

## Scope

**In:**

- Una única migración aplicada con `apply_migration` del MCP de Supabase contra el proyecto `rqvennwvmfjsuvjqwnim`, versionada además en `supabase/migrations/`.
- Enums que usa `users`: `user_role` (`staff`, `parent`, `admin`) y `user_status` (`pending`, `active`). Solo esos dos — el resto de enums del doc llegan con sus tablas.
- Tabla `public.users` según el doc: `id` PK FK → `auth.users(id)` ON DELETE CASCADE, `daycare_id` NOT NULL FK → `daycares` (1 guardería ─< N usuarios), `role` default `'parent'`, `status` default `'active'`, `full_name` NOT NULL, `avatar_url` nullable, `notify_on_post` / `daily_summary_enabled` defaults `true`, `created_at` / `updated_at` + índice en la FK.
- Schema `private` (no expuesto por la Data API) con helpers SECURITY DEFINER `current_user_role()` y `current_daycare_id()` (`search_path` pineado).
- Trigger `on_auth_user_created` (`AFTER INSERT ON auth.users`, función SECURITY DEFINER en `private`): crea el perfil leyendo `role` desde `raw_app_meta_data` (confiable, fallback `'parent'`) y `full_name` / `daycare_id` desde `raw_user_meta_data`.
- `updated_at` automático vía extensión `moddatetime`.
- RLS: SELECT (fila propia, o staff de la misma guardería), UPDATE (fila propia, sin poder cambiarse `role` ni `daycare_id`). Sin políticas INSERT/DELETE.
- Alta de un usuario staff de prueba vía `execute_sql` (insert en `auth.users` con `crypt()` + `raw_app_meta_data`); SQL no se versiona ni se commitea con credenciales.
- Verificación con herramientas MCP (`list_migrations`, `execute_sql`, `list_tables`, `get_advisors`).

**Out of scope (para futuros specs):**

- Resto de tablas del doc (`rooms`, `children`, `parent_children`, `invitations`, `posts`, `post_children`, `post_photos`, `reactions`, `comments`, `daily_summaries`, `devices`) y sus enums (`relationship_type`, `invitation_status`, `post_type`, `child_status`).
- Signup desde la app (UI), flujo de invitaciones, pantallas de staff de los mockups.
- Cliente `supabase-js` en la app Next.js y tipos TypeScript de la BD (decisión del usuario: al integrar el cliente).
- Políticas INSERT/DELETE en `users`; rol `admin` con privilegios extra; Storage/avatars.

## Data model

SQL completo que se envía a `apply_migration` (después se versiona en `supabase/migrations/<versión>_create_users_table.sql`):

```sql
create schema if not exists private;

-- Enums que usa users (el resto llega con sus tablas)
create type public.user_role as enum ('staff', 'parent', 'admin');
create type public.user_status as enum ('pending', 'active');

create table public.users (
  id                    uuid primary key references auth.users (id) on delete cascade,
  daycare_id            uuid not null references public.daycares (id),
  role                  public.user_role not null default 'parent',
  status                public.user_status not null default 'active',
  full_name             text not null,
  avatar_url            text,
  notify_on_post        boolean not null default true,
  daily_summary_enabled boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index users_daycare_id_idx on public.users (daycare_id);

-- updated_at automático
create extension if not exists moddatetime;
create trigger users_updated_at
  before update on public.users
  for each row execute function moddatetime (updated_at);

-- Helpers: SECURITY DEFINER para evitar recursión de RLS al autoleer users.
-- En private (no expuesto por la Data API) y search_path pineado.
revoke all on schema private from anon, authenticated;

create function private.current_user_role ()
returns public.user_role
language sql stable security definer
set search_path = ''
as $$
  select role from public.users where id = (select auth.uid())
$$;

create function private.current_daycare_id ()
returns uuid
language sql stable security definer
set search_path = ''
as $$
  select daycare_id from public.users where id = (select auth.uid())
$$;

-- Perfil de aplicación al crear un usuario en Auth (mismo UUID).
-- role desde app_metadata (solo editable server-side) para impedir escalada;
-- full_name y daycare_id del signup viajan en raw_user_meta_data.
create function private.handle_new_user ()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_role       public.user_role;
  v_daycare_id uuid;
  v_full_name  text;
begin
  v_role       := coalesce(new.raw_app_meta_data ->> 'role', 'parent')::public.user_role;
  v_daycare_id := coalesce(
    new.raw_app_meta_data ->> 'daycare_id',
    new.raw_user_meta_data ->> 'daycare_id'
  )::uuid;
  v_full_name  := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1));

  if v_daycare_id is null then
    raise exception 'Signup requires daycare_id in metadata';
  end if;

  insert into public.users (id, daycare_id, role, full_name)
  values (new.id, v_daycare_id, v_role, v_full_name);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user ();

alter table public.users enable row level security;

create policy "users_select_own_or_same_daycare_staff"
  on public.users
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (
      private.current_user_role () = 'staff'
      and daycare_id = private.current_daycare_id ()
    )
  );

create policy "users_update_own_profile"
  on public.users
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and role = private.current_user_role ()
    and daycare_id = private.current_daycare_id ()
  );
```

Alta del usuario staff de prueba (por `execute_sql`, **no** forma parte de la migración; la contraseña no se commitea):

```sql
insert into auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'staff.soles@opendaycare.test',
  crypt('<password>', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'provider', 'email',
    'providers', jsonb_build_array('email'),
    'role', 'staff',
    'daycare_id', (select id from public.daycares where name = 'Guardería Sala Soles')
  ),
  jsonb_build_object('full_name', 'Docente Soles'),
  now(), now(), '', ''
);
```

Convenciones del doc: PK uuid default `gen_random_uuid()` (aquí la aporta `auth.users`), persistido en inglés, etiquetas visibles traducidas en UI. No se duplican `email` ni `password_hash` — viven en `auth.users`.

## Implementation plan

1. Estado previo: `list_migrations` + `execute_sql` sobre `pg_tables` / `pg_type` para confirmar que `public.users`, `user_role`, `user_status` y el schema `private` no existen; obtener el `id` real de «Guardería Sala Soles». Manual: reporte del estado actual.
2. `apply_migration("create_users_table", <SQL del data model>)`. Manual: la herramienta confirma aplicación exitosa.
3. Verificación estructural con `execute_sql`: enums, columnas, FKs (incluido `confdeltype = 'c'`), índice, triggers y políticas. El checklist completo queda en Acceptance criteria.
4. Alta del staff de prueba con el SQL de arriba (contraseña generada al vuelo, solo en la sesión MCP) y verificación de que el trigger creó el perfil con `role = 'staff'`.
5. Tests de comportamiento del trigger: usuario sin `role` en `app_metadata` → perfil `parent` (fallback); usuario sin `daycare_id` → signup abortado con la exception; delete del usuario de prueba → perfil borrado por cascade.
6. Verificación de RLS: `set local role anon` → 0 filas; staff simulado con `set local request.jwt.claims` → ve su guardería; intento de `update ... set role = 'admin'` sobre la propia fila → bloqueado por `WITH CHECK`.
7. `get_advisors` (security) tras el DDL y resolver avisos. Versionar el SQL en `supabase/migrations/<versión>_create_users_table.sql` con el timestamp real que devolvió `apply_migration`.

## Acceptance criteria

- [x] `list_migrations` muestra la migración `create_users_table` aplicada.
  > ✅ MCP `list_migrations` → versión `20261112205420`, name `create_users_table` (última de las 4 registradas).
- [x] El SQL completo vive versionado en `supabase/migrations/<versión>_create_users_table.sql` y coincide con lo aplicado.
  > ✅ `supabase/migrations/20261112205420_create_users_table.sql` (106 líneas); MD5 del fichero = `065745d432539289b04a3e063868cb72` = `md5(btrim(statements[1], chr(10)))` en `supabase_migrations.schema_migrations`. El array del historial solo añade `\n` delimitadores inicial/final.
- [x] `unnest(enum_range(null::public.user_role))` devuelve exactamente `staff`, `parent`, `admin`; y `user_status` exactamente `pending`, `active`.
  > ✅ `execute_sql` → `enum_user_role: staff,parent,admin`; `enum_user_status: pending,active`.
- [x] `information_schema.columns` confirma `public.users` con exactamente las columnas `id`, `daycare_id`, `role`, `status`, `full_name`, `avatar_url`, `notify_on_post`, `daily_summary_enabled`, `created_at`, `updated_at` con sus tipos/nullable/default según el data model.
  > ✅ 10 columnas exactas: `id`/`daycare_id` uuid NOT NULL, `role` user_role NOT NULL default `'parent'`, `status` user_status NOT NULL default `'active'`, `full_name` text NOT NULL, `avatar_url` text nullable, `notify_on_post`/`daily_summary_enabled` bool NOT NULL default `true`, `created_at`/`updated_at` timestamptz NOT NULL default `now()`.
- [x] `pg_constraint` confirma FK `id` → `auth.users` con `ON DELETE CASCADE` (`confdeltype = 'c'`) y FK `daycare_id` → `daycares`; `pg_indexes` contiene `users_daycare_id_idx`.
  > ✅ `users_id_fkey` (`confdeltype=c`), `users_daycare_id_fkey`; índices `users_daycare_id_idx` + `users_pkey`.
- [x] `pg_trigger` contiene `on_auth_user_created` sobre `auth.users` y `users_updated_at` sobre `public.users` (moddatetime).
  > ✅ `on_auth_user_created` en `auth.users`; `users_updated_at` en `public.users` ejecuta `public.moddatetime`.
- [x] Alta del staff vía SQL → el trigger crea la fila en `public.users` con `role = 'staff'`, `status = 'active'`, `full_name = 'Docente Soles'` y el `daycare_id` de «Guardería Sala Soles» (verificado con join a `daycares`).
  > ✅ Fila de `staff.soles@opendaycare.test`: `role=staff`, `status=active`, `full_name='Docente Soles'`, join a `daycares` → `Guardería Sala Soles`.
- [x] Alta de un usuario Auth sin `role` en `raw_app_meta_data` → perfil creado con `role = 'parent'` (fallback); su delete en `auth.users` borra el perfil por cascade.
  > ✅ Test transaccional con `rollback`: app_metadata sin `role` → perfil `parent`/`active`/`Parent Fallback Test` (Guardería Estrellitas); `delete from auth.users` → 0 perfiles tras cascade.
- [x] Insert en `auth.users` sin `daycare_id` en metadata falla con la exception `Signup requires daycare_id in metadata` (probado dentro de una transacción con `rollback`).
  > ✅ Error `P0001: Signup requires daycare_id in metadata` (contexto `private.handle_new_user() line 15`); sin filas residuales de `auth.users` ni `public.users` tras el fallo.
- [x] Con `set local role anon`, `select count(*) from public.users` devuelve 0 (RLS bloquea al anónimo).
  > ✅ `begin; set local role anon; select count(*)` → `0`; `rollback`.
- [x] Con `set local role authenticated` + `request.jwt.claims` del staff, `select` sobre `public.users` devuelve su fila y las de su guardería, y ninguna de otra guardería.
  > ✅ Sesión simulada del staff → solo su fila (Guardería Sala Soles); el padre de Guardería Estrellitas (otra guardería) no aparece.
- [x] Con la sesión simulada del staff, `update public.users set role = 'admin' where id = <staff>` falla con error de RLS (`42501`, violación de `WITH CHECK`), y un `update ... set full_name` propio sí funciona moviendo `updated_at` (trigger moddatetime).
  > ✅ `update set role='admin'` → `42501: new row violates row-level security policy for table "users"` (WITH CHECK); `update set full_name` OK con `updated_at > created_at` (moddatetime); el `rollback` restauró el valor.
- [x] `set local role anon` / `authenticated` no puede usar el schema `private` (`permission denied`) y `get_advisors` (security) no reporta issues críticos nuevos derivados de esta migración.
  > ✅ `anon` y `authenticated` → `42501: permission denied for schema private`. `get_advisors` (security): 4 WARN, 0 críticos. Único derivado de esta migración: `extension_in_public` (WARN, `moddatetime` en `public`; mover a schema `extensions` en una futura migración). Los otros 3 (`rls_auto_enable` ×2, leaked password protection) son previos.

## Decisions

- **Sí:** `role` se lee de `raw_app_meta_data`, no de `raw_user_meta_data` como dice el doc — desvío consciente: `raw_user_meta_data` es editable por el cliente y permitiría a cualquier padre registrarse como `admin`. El fallback `'parent'` mantiene el flujo de signup de padres del doc.
- **Sí:** helpers y la función del trigger en schema `private` (SECURITY DEFINER con `search_path` pineado y USAGE revocado) — patrón recomendado para evitar recursión de RLS al autoleer `users`.
- **Sí:** `daycare_id` NOT NULL; si el signup no lo trae, el trigger aborta con mensaje claro (el signup entero se revierte).
- **Sí:** RLS de lectura ampliado a staff de la misma guardería (decisión del usuario) — base para el futuro flujo de invitaciones y para mostrar autores del feed.
- **Sí:** alta del staff de prueba vía SQL por MCP (decisión del usuario); credenciales solo en la sesión, nunca en el repo. En producción el alta de staff se hará desde el Dashboard / admin API.
- **Sí:** `updated_at` con `moddatetime` — el doc pide `created_at`/`updated_at` en `users` (en `daycares` no se añadió porque su definición solo lista `created_at`).
- **No:** tipos TypeScript de la BD (decisión del usuario; se generarán al integrar `supabase-js`).
- **No:** resto de enums y tablas del doc — cada tabla en su propio spec.
- **No:** políticas INSERT/DELETE — el alta de perfiles es vía trigger (definer) y el borrado de usuarios se hace desde Auth.

## Risks

| Risk | Mitigation |
| --- | --- |
| Insert manual en `auth.users` omite `auth.identities` y depende de internals de GoTrue | Solo para demo/verificación; en producción, Dashboard/admin API; el SQL no se versiona |
| Un error en `handle_new_user` aborta el signup completo (la fila de Auth se revierte) | Caso probado en verificación (falta de `daycare_id`) con mensaje de error explícito |
| Funciones SECURITY DEFINER expuestas por error | Viven en `private` (no expuesto por la Data API), `search_path` pineado y USAGE revocado para `anon`/`authenticated` |
| JWT con claims desactualizados tras cambiar `role`/`daycare_id` en `app_metadata` | La autorización (RLS) lee siempre `public.users`, no los claims; `app_metadata` solo alimenta el alta |

## What is **not** in this spec

- Cualquier otra tabla, enum, política de escritura adicional o bucket de storage.
- Integración con la app Next.js (cliente, fetching, UI, signup real).
