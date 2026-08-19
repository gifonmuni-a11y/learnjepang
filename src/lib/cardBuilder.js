// ============================================================
// Mapper: data asli (kanji.json, kana.json, kotoba.json) ->
// skema flashcard (lihat cardSchema.js)
// ============================================================
import kanjiData from '../data/kanji.json'
import kanjiEn from '../data/kanji-en.json'
import hiraganaData from '../data/hiragana.json'
import katakanaData from '../data/katakana.json'
import kotobaData from '../data/kotoba.json'

const enOf = (kanji) => kanjiEn[kanji] || ''

function toVocab(examples = []) {
  return examples
    .filter((e) => e.word || e.reading || e.meaning)
    .map((e) => ({
      furigana: e.reading || '',
      kanji: e.word || '',
      arti: e.meaning || ''
    }))
}

function toCard(k) {
  return {
    id: k.id,
    char: k.kanji,
    furigana_atas: (k.furigana || '').split(/[\/、\s]/)[0] || '',
    arti_id: k.meaning,
    arti_en: enOf(k.kanji),
    kunyomi: Array.isArray(k.kunyomi) ? k.kunyomi.join(', ') : k.kunyomi || '-',
    onyomi: Array.isArray(k.onyomi) ? k.onyomi.join(', ') : k.onyomi || '-',
    kosakata: toVocab(k.examples)
  }
}

function kanaToCard(x, type) {
  return {
    id: x.id,
    char: x.char,
    furigana_atas: x.romaji || '',
    arti_id: x.mnemonicNote || type,
    arti_en: x.romaji || '',
    kunyomi: '-',
    onyomi: '-',
    kosakata: []
  }
}

/** Semua kanji (N5 + N4) — default library */
export function buildKanjiDeck(level = 'ALL') {
  const list = level === 'ALL' ? kanjiData : kanjiData.filter((k) => k.level === level)
  return list.map(toCard)
}

export function buildHiraganaDeck() {
  return hiraganaData.map((x) => kanaToCard(x, 'Hiragana'))
}

export function buildKatakanaDeck() {
  return katakanaData.map((x) => kanaToCard(x, 'Katakana'))
}

/** Deck kosakata khusus — kartu depan = kosakata, belakang = contoh */
export function buildKotobaDeck(level = 'ALL') {
  const list = level === 'ALL' ? kotobaData : kotobaData.filter((k) => k.level === level)
  return list.slice(0, 60).map((k) => ({
    id: k.id,
    char: k.word,
    furigana_atas: k.reading || '',
    arti_id: k.meaning,
    arti_en: k.romaji || '',
    kunyomi: '-',
    onyomi: '-',
    kosakata: []
  }))
}

export const PRESET_LIBRARIES = [
  { id: 'kanji-n5', label: 'Kanji N5', desc: '123 kanji dasar', build: () => buildKanjiDeck('N5') },
  { id: 'kanji-n4', label: 'Kanji N4', desc: '182 kanji lanjutan', build: () => buildKanjiDeck('N4') },
  { id: 'kanji-all', label: 'Kanji N5 + N4', desc: '305 kanji lengkap', build: () => buildKanjiDeck('ALL') },
  { id: 'hiragana', label: 'Hiragana', desc: '104 huruf dasar + dakuten', build: () => buildHiraganaDeck() },
  { id: 'katakana', label: 'Katakana', desc: '127 huruf dasar + gairaigo', build: () => buildKatakanaDeck() },
  { id: 'kotoba-n5', label: 'Kotoba N5', desc: 'Kosakata sehari-hari', build: () => buildKotobaDeck('N5') }
]