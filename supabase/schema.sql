-- ============================================================
-- HW LEARN — Schema Supabase
-- Jalankan SEKALI di Supabase SQL Editor (project yang sama
-- dengan Senka: wlioszpxlecrwcxjyjnu.supabase.co)
--
-- Isi:
-- 1. srs_progress   : state SRS per user per kartu
-- 2. custom_decks   : deck hafalan custom milik user
-- 3. custom_cards   : kartu dalam deck custom
-- 4. quiz_attempts  : histori & skor kuis
--
-- SEMUA tabel memakai Row Level Security (WAJIB):
-- user hanya bisa mengakses baris miliknya sendiri.
-- ============================================================

-- ============================================================
-- 1. SRS PROGRESS
-- ============================================================
create table if not exists public.srs_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  card_type text not null, -- 'hiragana' | 'katakana' | 'kanji' | 'bunpou' | 'kotoba' | 'custom'
  card_id text not null,   -- id kartu dari JSON master, atau id custom card
  ease_factor float default 2.5,
  interval_days int default 0,
  repetitions int default 0,
  next_review_date date,
  last_reviewed_at timestamptz,
  unique (user_id, card_type, card_id)
);

alter table public.srs_progress enable row level security;

drop policy if exists "srs_progress_select_own" on public.srs_progress;
create policy "srs_progress_select_own" on public.srs_progress
  for select using (auth.uid() = user_id);

drop policy if exists "srs_progress_insert_own" on public.srs_progress;
create policy "srs_progress_insert_own" on public.srs_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "srs_progress_update_own" on public.srs_progress;
create policy "srs_progress_update_own" on public.srs_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "srs_progress_delete_own" on public.srs_progress;
create policy "srs_progress_delete_own" on public.srs_progress
  for delete using (auth.uid() = user_id);

create index if not exists srs_progress_user_idx on public.srs_progress (user_id);
create index if not exists srs_progress_due_idx on public.srs_progress (user_id, next_review_date);

-- ============================================================
-- 2. CUSTOM DECKS
-- ============================================================
create table if not exists public.custom_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  deck_name text not null,
  created_at timestamptz default now()
);

alter table public.custom_decks enable row level security;

drop policy if exists "custom_decks_select_own" on public.custom_decks;
create policy "custom_decks_select_own" on public.custom_decks
  for select using (auth.uid() = user_id);

drop policy if exists "custom_decks_insert_own" on public.custom_decks;
create policy "custom_decks_insert_own" on public.custom_decks
  for insert with check (auth.uid() = user_id);

drop policy if exists "custom_decks_update_own" on public.custom_decks;
create policy "custom_decks_update_own" on public.custom_decks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "custom_decks_delete_own" on public.custom_decks;
create policy "custom_decks_delete_own" on public.custom_decks
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 3. CUSTOM CARDS
-- ============================================================
create table if not exists public.custom_cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references public.custom_decks on delete cascade not null,
  main_text text not null,
  furigana text,
  onyomi text,
  kunyomi text,
  meaning text,
  created_at timestamptz default now()
);

alter table public.custom_cards enable row level security;

drop policy if exists "custom_cards_select_own" on public.custom_cards;
create policy "custom_cards_select_own" on public.custom_cards
  for select using (
    exists (
      select 1 from public.custom_decks d
      where d.id = deck_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "custom_cards_insert_own" on public.custom_cards;
create policy "custom_cards_insert_own" on public.custom_cards
  for insert with check (
    exists (
      select 1 from public.custom_decks d
      where d.id = deck_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "custom_cards_update_own" on public.custom_cards;
create policy "custom_cards_update_own" on public.custom_cards
  for update using (
    exists (
      select 1 from public.custom_decks d
      where d.id = deck_id and d.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.custom_decks d
      where d.id = deck_id and d.user_id = auth.uid()
    )
  );

drop policy if exists "custom_cards_delete_own" on public.custom_cards;
create policy "custom_cards_delete_own" on public.custom_cards
  for delete using (
    exists (
      select 1 from public.custom_decks d
      where d.id = deck_id and d.user_id = auth.uid()
    )
  );

-- ============================================================
-- 4. QUIZ ATTEMPTS
-- ============================================================
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  module text not null, -- 'hiragana-katakana' | 'bunpou-kotoba' | 'kanji' | 'simulasi-jlpt'
  level text,           -- 'N5' | 'N4'
  score int,
  total_questions int,
  taken_at timestamptz default now()
);

alter table public.quiz_attempts enable row level security;

drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
create policy "quiz_attempts_select_own" on public.quiz_attempts
  for select using (auth.uid() = user_id);

drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);

drop policy if exists "quiz_attempts_update_own" on public.quiz_attempts;
create policy "quiz_attempts_update_own" on public.quiz_attempts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "quiz_attempts_delete_own" on public.quiz_attempts;
create policy "quiz_attempts_delete_own" on public.quiz_attempts
  for delete using (auth.uid() = user_id);

create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id, taken_at desc);
