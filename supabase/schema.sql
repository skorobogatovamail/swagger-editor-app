-- Run this in the Supabase SQL editor for your project.

create table if not exists public.user_schemas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  content text not null,
  format text not null check (format in ('json', 'yaml')),
  updated_at timestamptz not null default now()
);

create table if not exists public.request_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  method text not null,
  url text not null,
  endpoint_method text,
  endpoint_path text,
  status integer not null default 0,
  duration_ms integer not null default 0,
  request_size integer not null default 0,
  response_size integer not null default 0,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists request_history_user_id_created_at_idx
  on public.request_history (user_id, created_at desc);

alter table public.user_schemas enable row level security;
alter table public.request_history enable row level security;

create policy "Users manage own schema"
  on public.user_schemas
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own history"
  on public.request_history
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
