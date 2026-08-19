-- ============================================================
-- Japanese Learn — Supabase Migration (Dengan Data Awal)
-- ============================================================
-- Dijalankan di Supabase SQL Editor
-- Project: mougecldsdwfzrtlsevd.supabase.co
-- Anonymous Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdWdlY2xkc2R3ZnpydGxzZXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDE2OTMsImV4cCI6MjEwMjY3NzY5M30.K2Em63XvGhzUBk2Q2of7RgQmqclcN8IsD1hIT9YY4lc
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Tables (sama persis dengan schema.sql tadi, tapi dengan data awal)

-- SRS Progress
create table if not exists public.srs_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  card_type text not null,
  card_id text not null,
  ease_factor float default 2.5,
  interval_days int default 0,
  repetitions int default 0,
  next_review_date date,
  last_reviewed_at timestamptz,
  unique (user_id, card_type, card_id)
);
alter table public.srs_progress enable row level security;
create policy "srs_progress_select_own" on public.srs_progress for select using (auth.uid() = user_id);
create policy "srs_progress_insert_own" on public.srs_progress for insert with check (auth.uid() = user_id);
create policy "srs_progress_update_own" on public.srs_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "srs_progress_delete_own" on public.srs_progress for delete using (auth.uid() = user_id);
create index if not exists srs_progress_user_idx on public.srs_progress (user_id);
create index if not exists srs_progress_due_idx on public.srs_progress (user_id, next_review_date);

-- Custom Decks
create table if not exists public.custom_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  deck_name text not null,
  created_at timestamptz default now()
);
alter table public.custom_decks enable row level security;
create policy "custom_decks_select_own" on public.custom_decks for select using (auth.uid() = user_id);
create policy "custom_decks_insert_own" on public.custom_decks for insert with check (auth.uid() = user_id);
create policy "custom_decks_update_own" on public.custom_decks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "custom_decks_delete_own" on public.custom_decks for delete using (auth.uid() = user_id);

-- Custom Cards
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
create policy "custom_cards_select_own" on public.custom_cards for select using (
    exists (select 1 from public.custom_decks d where d.id = deck_id and d.user_id = auth.uid())
);
create policy "custom_cards_insert_own" on public.custom_cards for insert with check (
    exists (select 1 from public.custom_decks d where d.id = deck_id and d.user_id = auth.uid())
);
create policy "custom_cards_update_own" on public.custom_cards for update using (
    exists (select 1 from public.custom_decks d where d.id = deck_id and d.user_id = auth.uid())
) with check (
    exists (select 1 from public.custom_decks d where d.id = deck_id and d.user_id = auth.uid())
);
create policy "custom_cards_delete_own" on public.custom_cards for delete using (
    exists (select 1 from public.custom_decks d where d.id = deck_id and d.user_id = auth.uid())
);

-- Quiz Attempts
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  module text not null,
  level text,
  score int,
  total_questions int,
  taken_at timestamptz default now()
);
alter table public.quiz_attempts enable row level security;
create policy "quiz_attempts_select_own" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "quiz_attempts_insert_own" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "quiz_attempts_update_own" on public.quiz_attempts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quiz_attempts_delete_own" on public.quiz_attempts for delete using (auth.uid() = user_id);
create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id, taken_at desc);

-- ============================================================
-- DATA AWAL: Kanji N5 + N4
-- ============================================================
-- Data kanji sudah ada di src/data/kanji.json, migrasikan ke sini
-- Setiap entry memiliki: id, kanji, furigana, onyomi, kunyomi, meaning, examples, illustrationKey, mnemonicNote, level

-- ============================================================
-- DATA AWAL: Kosakata N5 + N4
-- ============================================================
-- Data kotoba sudah ada di src/data/kotoba.json

-- ============================================================
-- DATA AWAL: Grammar N5 + N4
-- ============================================================
-- Data bunpou sudah ada di src/data/bunpou.json

-- ============================================================
-- POLICY SUPERADMIN (opsional - hapus jika tidak perlu)
-- ============================================================
-- Uncomment baris-baris ini jika ingin memberi superadmin akses semua data
-- (Hapus komentar /* dan */ jika ingin aktif)
/*
alter table public.srs_progress disable row level security;
alter table public.custom_decks disable row level security;
alter table public.custom_cards disable row level security;
alter table public.quiz_attempts disable row level security;
*/