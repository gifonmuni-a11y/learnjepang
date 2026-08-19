// ============================================================
// Mapper: data asli (kanji.json, kotoba.json) ->
// skema flashcard (lihat cardSchema.js)
// ============================================================
import kanjiData from '../data/kanji.json'
import kanjiEn from '../data/kanji-en.json'
import kanjiExtraN5 from '../data/kanji-vocab-extra-n5.json'
import kanjiExtraN4 from '../data/kanji-vocab-extra-n4.json'
import kotobaData from '../data/kotoba.json'

const enOf = (kanji) => kanjiEn[kanji] || ''

const KANJI_EXTRA = { ...kanjiExtraN5, ...kanjiExtraN4 }

const KOTOBA_BY_KANJI = (() => {
  const map = {}
  for (const w of kotobaData) {
    for (const ch of w.word) {
      if (/[\u4e00-\u9fff]/.test(ch)) {
        ;(map[ch] ||= []).push({ furigana: w.reading, kanji: w.word, arti: w.meaning })
      }
    }
  }
  return map
})()

function toVocab(examples = []) {
  return examples
    .filter((e) => e.word || e.reading || e.meaning)
    .map((e) => ({
      furigana: e.reading || '',
      kanji: e.word || '',
      arti: e.meaning || ''
    }))
}

/** Gabungkan contoh asli + kosakata tambahan (subagent) + kata dari kotoba.json */
function mergeVocab(k) {
  const seen = new Set()
  const out = []
  const push = (v) => {
    if (!v || !v.kanji) return
    const key = v.kanji + '|' + v.furigana
    if (seen.has(key)) return
    seen.add(key)
    out.push(v)
  }
  toVocab(k.examples).forEach(push)
  ;(KANJI_EXTRA[k.kanji] || []).forEach(push)
  ;(KOTOBA_BY_KANJI[k.kanji] || []).forEach(push)
  return out
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
    kosakata: mergeVocab(k)
  }
}

/** Kartu tunggal dari satu entry kanji (dipakai halaman Kanji & popup) */
export function kanjiToCard(k) {
  return toCard(k)
}

/** Semua kanji (N5 + N4) — default library */
export function buildKanjiDeck(level = 'ALL') {
  const list = level === 'ALL' ? kanjiData : kanjiData.filter((k) => k.level === level)
  return list.map(toCard)
}

/** Deck kosakata lengkap (N5 + N4) */
export function buildKotobaDeck(level = 'ALL') {
  const list = level === 'ALL' ? kotobaData : kotobaData.filter((k) => k.level === level)
  return list.map((k) => ({
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
  { id: 'kotoba-n5', label: 'Kotoba N5', desc: '478 kosakata sehari-hari', build: () => buildKotobaDeck('N5') },
  { id: 'kotoba-n4', label: 'Kotoba N4', desc: '440 kosakata lanjutan', build: () => buildKotobaDeck('N4') }
]