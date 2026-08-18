// Sinkronisasi state SRS + histori kuis.
// Login → Supabase (srs_progress / quiz_attempts). Tamu → localStorage.
import { supabase } from './supabase'

const LS_PREFIX = 'hwlearn:srs:'

export async function loadSrsStates(userId, cardType) {
  if (userId) {
    const { data, error } = await supabase
      .from('srs_progress')
      .select('card_id, ease_factor, interval_days, repetitions, next_review_date, last_reviewed_at')
      .eq('user_id', userId)
      .eq('card_type', cardType)
    if (error) throw error
    const map = {}
    ;(data || []).forEach((r) => {
      map[r.card_id] = {
        easeFactor: r.ease_factor,
        intervalDays: r.interval_days,
        repetitions: r.repetitions,
        nextReviewDate: r.next_review_date,
        lastReviewedAt: r.last_reviewed_at
      }
    })
    return map
  }
  try {
    return JSON.parse(localStorage.getItem(LS_PREFIX + cardType)) || {}
  } catch {
    return {}
  }
}

export async function saveSrsState(userId, cardType, cardId, state) {
  if (userId) {
    const { error } = await supabase
      .from('srs_progress')
      .upsert(
        {
          user_id: userId,
          card_type: cardType,
          card_id: cardId,
          ease_factor: state.easeFactor,
          interval_days: state.intervalDays,
          repetitions: state.repetitions,
          next_review_date: state.nextReviewDate,
          last_reviewed_at: state.lastReviewedAt
        },
        { onConflict: 'user_id,card_type,card_id' }
      )
    if (error) throw error
    return
  }
  const key = LS_PREFIX + cardType
  let map = {}
  try {
    map = JSON.parse(localStorage.getItem(key)) || {}
  } catch {
    map = {}
  }
  map[cardId] = state
  localStorage.setItem(key, JSON.stringify(map))
}

export async function saveQuizAttempt(userId, module, level, score, total) {
  if (!userId) return
  await supabase.from('quiz_attempts').insert({
    user_id: userId,
    module,
    level,
    score,
    total_questions: total
  })
}

export async function loadQuizHistory(userId) {
  if (!userId) return []
  const { data } = await supabase
    .from('quiz_attempts')
    .select('*')
    .order('taken_at', { ascending: false })
    .limit(20)
  return data || []
}