// ============================================================
// JSON Schema untuk komponen Flashcard
// ------------------------------------------------------------
// Struktur data yang diharapkan oleh <FlashcardCard /> & form
// Custom Deck. Setiap item = satu kartu. Maksimal 8 kosakata
// di sisi belakang (grid 4 baris x 2 kolom).
//
// {
//   "id": "string | number",            // WAJIB — unik
//   "char": "string",                   // WAJIB — huruf utama (kanji/kana)
//   "furigana_atas": "string",          // opsional — furigana utama (bisa di-hide)
//   "arti_id": "string",                // WAJIB — arti Bahasa Indonesia
//   "arti_en": "string",                // opsional — arti Bahasa Inggris
//   "kunyomi": "string",                // opsional — "ひと(つ)" (italic di UI)
//   "onyomi": "string",                 // opsional — "イチ, イツ" (italic di UI)
//   "kosakata": [                       // opsional — max 8 item
//     { "furigana": "string",           //   baris 1 (hiragana, warna aksen)
//       "kanji": "string",              //   baris 2 (font bold besar)
//       "arti": "string" }              //   baris 3 (Bahasa Indonesia)
//   ]
// }
// ============================================================

export const VOCAB_SLOTS = 8

export const cardSchema = {
  type: 'object',
  required: ['id', 'char', 'arti_id'],
  properties: {
    id: { type: ['string', 'number'] },
    char: { type: 'string', minLength: 1 },
    furigana_atas: { type: 'string' },
    arti_id: { type: 'string' },
    arti_en: { type: 'string' },
    kunyomi: { type: 'string' },
    onyomi: { type: 'string' },
    kosakata: {
      type: 'array',
      maxItems: VOCAB_SLOTS,
      items: {
        type: 'object',
        required: ['furigana', 'kanji', 'arti'],
        properties: {
          furigana: { type: 'string' },
          kanji: { type: 'string' },
          arti: { type: 'string' }
        }
      }
    }
  }
}

/** Validasi ringan: pastikan kartu minimal punya char + arti_id */
export function validateCard(card) {
  if (!card) return 'Kartu kosong'
  if (!card.id) return 'Kartu wajib punya id'
  if (!card.char || !card.char.trim()) return 'Huruf utama (char) wajib diisi'
  if (!card.arti_id || !card.arti_id.trim()) return 'Arti Bahasa Indonesia wajib diisi'
  return null
}

/** Isi slot kosong sampai 8 agar grid sisi belakang selalu stabil */
export function padVocab(kosakata = []) {
  const filled = kosakata.slice(0, VOCAB_SLOTS)
  while (filled.length < VOCAB_SLOTS) filled.push({ furigana: '', kanji: '', arti: '' })
  return filled
}