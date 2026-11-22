-- دعوتنا — جداول قاعدة البيانات (Supabase / Postgres)
-- شغّل الملف ده كله مرة واحدة من: Supabase ← SQL Editor ← New query ← Run

create table if not exists orders (
  id            text primary key,                       -- مثال: DA3-482913
  package_id    text not null,
  quantity      int  not null,
  amount        int  not null,                          -- بالجنيه
  method        text not null check (method in ('vodafone', 'instapay', 'paymob')),
  status        text not null default 'pending' check (status in ('pending', 'paid', 'rejected')),
  ref_no        text,                                   -- رقم عملية التحويل اليدوي
  owner_token   text not null unique,                   -- سر لوحة الزبون (بيتحط في اللينك)
  paymob_order_id text,
  created_at    timestamptz not null default now(),
  paid_at       timestamptz
);

create table if not exists invites (
  id          text primary key,                         -- كود قصير في لينك الدعوة
  order_id    text not null references orders(id) on delete cascade,
  draft       jsonb not null,
  created_at  timestamptz not null default now()
);
create index if not exists invites_order_idx on invites(order_id);

create table if not exists rsvps (
  id          bigint generated always as identity primary key,
  invite_id   text not null references invites(id) on delete cascade,
  name        text not null,
  attending   boolean not null,
  guests      int not null default 1,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists rsvps_invite_idx on rsvps(invite_id, created_at desc);

-- الوصول كله من خلال دوال /api باستخدام service key، فبنقفل الوصول المباشر.
alter table orders  enable row level security;
alter table invites enable row level security;
alter table rsvps   enable row level security;
