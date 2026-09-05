-- Run this migration in the Supabase SQL Editor.

alter table public.users add column if not exists phone text default '';
alter table public.users add column if not exists is_admin boolean not null default false;


alter table public.bookings add column if not exists itemid text;
alter table public.bookings add column if not exists status text not null default 'pending';


create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  booking_id uuid references public.bookings(id) on delete cascade,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_date_itemid_idx on public.bookings (date, itemid);
create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)), new.email, coalesce(new.raw_user_meta_data ->> 'phone', ''))
  on conflict (id) do update set name = excluded.name, email = excluded.email, phone = excluded.phone;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.users where id = auth.uid() and is_admin);
$$;

alter table public.users enable row level security;
alter table public.bookings enable row level security;
alter table public.notifications enable row level security;
alter table public.venues enable row level security;
alter table public.djs enable row level security;
alter table public.vendors enable row level security;

drop policy if exists "Allow app sync users" on public.users;
drop policy if exists "Allow app sync bookings" on public.bookings;
drop policy if exists "Allow app sync notifications" on public.notifications;
drop policy if exists "users: own profile" on public.users;
drop policy if exists "users: admin read" on public.users;
drop policy if exists "bookings: insert pending (owner only)" on public.bookings;
drop policy if exists "bookings: select own" on public.bookings;
drop policy if exists "bookings: admin update" on public.bookings;
drop policy if exists "bookings: owner delete" on public.bookings;
drop policy if exists "notifications: own" on public.notifications;

create policy "users: own profile" on public.users for select to authenticated
using (id = (select auth.uid()));
create policy "users: admin read" on public.users for select to authenticated
using ((select public.is_admin()));

create policy "bookings: insert pending (owner only)" on public.bookings for insert to authenticated
with check (status = 'pending' and user_id = ((select auth.uid())::text));
create policy "bookings: select own" on public.bookings for select to authenticated
using (user_id = ((select auth.uid())::text) or (select public.is_admin()));
create policy "bookings: admin update" on public.bookings for update to authenticated
using ((select public.is_admin()))
with check (status in ('pending', 'confirmed', 'cancelled'));
create policy "bookings: owner delete" on public.bookings for delete to authenticated
using (user_id = ((select auth.uid())::text));

create policy "notifications: own" on public.notifications for all to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()))
with check (user_id = (select auth.uid()) or (select public.is_admin()));

grant select on public.users to authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select on public.venues, public.djs, public.vendors to anon, authenticated;
grant insert, update, delete on public.venues, public.djs, public.vendors to authenticated;

drop policy if exists "catalog: public read venues" on public.venues;
drop policy if exists "catalog: admin write venues" on public.venues;
drop policy if exists "catalog: public read djs" on public.djs;
drop policy if exists "catalog: admin write djs" on public.djs;
drop policy if exists "catalog: public read vendors" on public.vendors;
drop policy if exists "catalog: admin write vendors" on public.vendors;
create policy "catalog: public read venues" on public.venues for select to anon, authenticated using (true);
create policy "catalog: admin write venues" on public.venues for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "catalog: public read djs" on public.djs for select to anon, authenticated using (true);
create policy "catalog: admin write djs" on public.djs for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "catalog: public read vendors" on public.vendors for select to anon, authenticated using (true);
create policy "catalog: admin write vendors" on public.vendors for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create table if not exists public.venues (
  id text primary key,
  name text not null,
  capacity integer not null,
  "costPerDay" numeric not null,
  description text not null,
  amenities jsonb not null default '[]'::jsonb,
  image text not null,
  location text not null
);

create table if not exists public.djs (
  id text primary key,
  name text not null,
  genre jsonb not null default '[]'::jsonb,
  "costPerDay" numeric not null,
  description text not null,
  experience text not null,
  image text not null,
  rating numeric not null
);

create table if not exists public.vendors (
  id text primary key,
  name text not null,
  type text not null,
  "costPerDay" numeric not null,
  description text not null,
  services jsonb not null default '[]'::jsonb,
  image text not null,
  rating numeric not null
);

