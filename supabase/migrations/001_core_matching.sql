-- Adult MVP: profiles, likes, matches, blocks and reports
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  age integer not null check (age >= 18 and age <= 120),
  city text not null,
  goal text not null default 'Dating',
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.likes (
  liker_id uuid not null references public.profiles(id) on delete cascade,
  liked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (liker_id, liked_id),
  check (liker_id <> liked_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b),
  check (user_a < user_b)
);

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  details text not null default '',
  created_at timestamptz not null default now(),
  check (reporter_id <> reported_id)
);

alter table public.profiles enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

create policy "profiles readable to signed in users" on public.profiles for select to authenticated using (true);
create policy "users create own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "users read own likes" on public.likes for select to authenticated using (auth.uid() = liker_id or auth.uid() = liked_id);
create policy "users create own likes" on public.likes for insert to authenticated with check (auth.uid() = liker_id);
create policy "users delete own likes" on public.likes for delete to authenticated using (auth.uid() = liker_id);

create policy "users read own matches" on public.matches for select to authenticated using (auth.uid() = user_a or auth.uid() = user_b);

create policy "users read own blocks" on public.blocks for select to authenticated using (auth.uid() = blocker_id);
create policy "users create own blocks" on public.blocks for insert to authenticated with check (auth.uid() = blocker_id);
create policy "users delete own blocks" on public.blocks for delete to authenticated using (auth.uid() = blocker_id);

create policy "users create reports" on public.reports for insert to authenticated with check (auth.uid() = reporter_id);
create policy "users read own reports" on public.reports for select to authenticated using (auth.uid() = reporter_id);

create or replace function public.create_match_if_mutual()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  low_id uuid;
  high_id uuid;
begin
  if exists (select 1 from public.likes where liker_id = new.liked_id and liked_id = new.liker_id) then
    low_id := least(new.liker_id, new.liked_id);
    high_id := greatest(new.liker_id, new.liked_id);
    insert into public.matches(user_a, user_b) values (low_id, high_id) on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists likes_create_match on public.likes;
create trigger likes_create_match after insert on public.likes for each row execute function public.create_match_if_mutual();
