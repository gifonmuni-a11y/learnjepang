// ============================================================
// Schema kartu MATERI (bunpou & partikel) — layout alternatif
// flashcard untuk pembelajaran materi, bukan kosakata.
// ============================================================

export const MATERIAL_CATEGORIES = [
  'Kata Kerja',
  'Kata Sifat',
  'Partikel',
  'Tata Bahasa Dasar',
  'Kata Bantu'
]

// Color-code kategori (digunakan badge depan & aksen)
export const CATEGORY_COLORS = {
  'Kata Kerja': {
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: '#3b82f6'
  },
  'Kata Sifat': {
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: '#10b981'
  },
  Partikel: {
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: '#f59e0b'
  },
  'Tata Bahasa Dasar': {
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    icon: '#0ea5e9'
  },
  'Kata Bantu': {
    chip: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    icon: '#8b5cf6'
  }
}

export const DEFAULT_CATEGORY = 'Tata Bahasa Dasar'

/**
 * Validasi kartu materi.
 * @param {object} card
 * @returns {string|null} pesan error atau null jika valid
 */
export function validateMaterialCard(card) {
  if (!card || typeof card !== 'object') return 'Kartu materi tidak valid.'
  if (!card.id) return 'Field "id" wajib diisi.'
  if (!card.category || !CATEGORY_COLORS[card.category]) return 'Field "category" wajib diisi (Kata Kerja / Kata Sifat / Partikel / Tata Bahasa Dasar / Kata Bantu).'
  if (!card.title || !card.title.trim()) return 'Field "title" (judul materi) wajib diisi.'
  if (!card.prompt || !card.prompt.trim()) return 'Field "prompt" (pertanyaan kuis) wajib diisi.'
  if (!card.pattern || !card.pattern.trim()) return 'Field "pattern" (rumus/pola kalimat) wajib diisi.'
  if (!Array.isArray(card.examples) || card.examples.length === 0) {
    return 'Field "examples" wajib berisi minimal 1 contoh.'
  }
  for (const ex of card.examples) {
    if (!ex.jp || !ex.id) return 'Setiap contoh wajib memiliki teks Jepang (jp) dan terjemahan (id).'
  }
  return null
}

/** Normalisasi contoh ke bentuk {furigana, jp, id} */
export function normalizeExample(ex) {
  return {
    furigana: ex.furigana || ex.reading || ex.romaji || '',
    jp: ex.jp || ex.text || '',
    id: ex.id || ex.meaning || ''
  }
}