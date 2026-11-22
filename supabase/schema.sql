-- Da3wetna core schema. Applied to Supabase project cchfesvyapiafwlozmyz.
-- Browser clients have no direct table permissions. API routes use a server-only key.

create table if not exists public.orders (
  id text primary key,
  package_id text not null check (package_id in ('single','basic','plus','premium')),
  quantity integer not null check (quantity > 0 and quantity <= 100),
  amount integer not null check (amount >= 0),
  method text not null check (method in ('vodafone','instapay','paymob')),
  status text not null default 'pending' check (status in ('pending','paid','rejected')),
  ref_no text,
  owner_token text not null unique,
  paymob_order_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.invites (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  draft jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id bigint generated always as identity primary key,
  invite_id text not null references public.invites(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 60),
  attending boolean not null,
  guests integer not null default 0 check (guests between 0 and 10),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists invites_order_id_idx on public.invites (order_id);
create index if not exists rsvps_invite_id_created_at_idx on public.rsvps (invite_id, created_at desc);

alter table public.orders enable row level security;
alter table public.invites enable row level security;
alter table public.rsvps enable row level security;

revoke all on table public.orders, public.invites, public.rsvps from anon, authenticated;
grant all on table public.orders, public.invites, public.rsvps to service_role;
grant usage, select on sequence public.rsvps_id_seq to service_role;
