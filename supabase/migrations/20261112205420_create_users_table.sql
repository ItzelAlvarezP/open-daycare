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

-- updated_at automatico
create extension if not exists moddatetime;
create trigger users_updated_at
  before update on public.users
  for each row execute function moddatetime (updated_at);

-- Helpers: SECURITY DEFINER para evitar recursion de RLS al autoleer users.
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

-- Perfil de aplicacion al crear un usuario en Auth (mismo UUID).
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
