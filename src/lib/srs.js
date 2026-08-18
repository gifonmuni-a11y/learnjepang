// ============================================================
// SRS — Spaced Repetition System (varian SM-2 ala Anki)
//
// Rating: 0 = Lupa, 1 = Susah, 2 = Biasa, 3 = Gampang
// State kartu: { easeFactor, intervalDays, repetitions, nextReviewDate }
// ============================================================

export const RATINGS = [
  { value: 0, label: 'Lupa', short: 'Lupa', tone: 'aka' },
  { value: 1, label: 'Susah', short: 'Susah', tone: 'kin' },
  { value: 2, label: 'Biasa', short: 'Biasa', tone: 'ao' },
  { value: 3, label: 'Gampang', short: 'Gampang', tone: 'wasabi' }
]

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function isDue(state, dateISO = todayISO()) {
  if (!state || state.nextReviewDate == null) return true
  return state.nextReviewDate <= dateISO
}

export function defaultState() {
  return {
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReviewDate: null,
    lastReviewedAt: null
  }
}

/**
 * Hitung state SRS baru setelah review.
 * @param {object} prev state sebelumnya (atau defaultState())
 * @param {number} rating 0..3
 * @returns {object} state baru (tanpa id)
 */
export function applyRating(prev, rating) {
  const state = prev && prev.nextReviewDate ? { ...prev } : defaultState()
  const now = new Date().toISOString()
  let { easeFactor, intervalDays, repetitions } = state

  if (rating === 0) {
    // Lupa → mulai dari nol
    repetitions = 0
    intervalDays = 1
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else if (rating === 1) {
    repetitions += 1
    intervalDays = Math.max(1, Math.round(intervalDays * Math.max(1.1, easeFactor - 0.15)))
    easeFactor = Math.max(1.3, easeFactor - 0.15)
  } else if (rating === 2) {
    repetitions += 1
    if (repetitions === 1) intervalDays = 1
    else if (repetitions === 2) intervalDays = 3
    else intervalDays = Math.round(intervalDays * easeFactor)
    easeFactor = Math.max(1.3, easeFactor + 0.02)
  } else {
    repetitions += 1
    if (repetitions === 1) intervalDays = 1
    else if (repetitions === 2) intervalDays = 4
    else intervalDays = Math.round(intervalDays * easeFactor * 1.3)
    easeFactor = Math.min(3.4, easeFactor + 0.08)
  }

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    intervalDays,
    repetitions,
    nextReviewDate: addDays(new Date(), intervalDays),
    lastReviewedAt: now
  }
}

/** Persentase penguasaan dari jumlah kartu yang pernah direview dan interval >= 21 hari (dikenal baik) */
export function masteryPercent(totalCards, reviewedStates) {
  if (totalCards === 0) return 0
  const mastered = reviewedStates.filter((s) => s && s.intervalDays >= 21).length
  return Math.round((mastered / totalCards) * 100)
}

export function dueCount(states, dateISO = todayISO()) {
  if (!states) return 0
  return states.filter((s) => isDue(s, dateISO)).length
}
