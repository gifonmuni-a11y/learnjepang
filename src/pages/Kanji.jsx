import { useEffect, useMemo, useState } from 'react'
import { Search, X, ChevronLeft, ChevronRight, FlipVertical } from 'lucide-react'
import kanjiData from '../data/kanji.json'
import { kanjiToCard } from '../lib/cardBuilder'
import FlashcardCard from '../components/FlashcardCard'

const LEVEL_STYLES = {
  N5: 'bg-blue-50 text-blue-700 border-blue-200',
  N4: 'bg-rose-50 text-rose-600 border-rose-200'
}

export default function Kanji() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all') // 'all' | 'N5' | 'N4'
  const [openIndex, setOpenIndex] = useState(null) // index di filtered

  const filtered = useMemo(() => {
    return kanjiData.filter(
      (e) =>
        (e.kanji + e.meaning + (e.mnemonicNote || '')).toLowerCase().includes(search.toLowerCase()) &&
        (level === 'all' || e.level === level)
    )
  }, [search, level])

  const openCard = filtered[openIndex]

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-up">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Kanji</h1>
        <span className="chip">{filtered.length} kanji</span>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Ketuk kanji untuk membuka flashcard 3D-nya.
      </p>

      {/* ===== Filter ===== */}
      <div className="flex items-center gap-2 mb-4">
        {['all', 'N5', 'N4'].map((lv) => (
          <button
            key={lv}
            onClick={() => {
              setLevel(lv)
              setSearch('')
              setOpenIndex(null)
            }}
            className={level === lv ? 'chip-active' : 'chip'}
          >
            {lv === 'all' ? 'Semua' : `Level ${lv}`}
          </button>
        ))}
      </div>
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kanji, baca, atau arti..."
          className="input-base pl-9"
        />
      </div>

      {/* ===== Grid kanji ===== */}
      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-10">Tidak ada kanji. Ubah filter.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setOpenIndex(i)}
              className="card-base p-4 text-left hover:shadow-lift transition-all active:scale-[0.98] group"
            >
              <div className="flex items-start justify-between">
                <span
                  className="font-display text-4xl text-slate-900 group-hover:text-blue-600 transition-colors"
                  style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif' }}
                >
                  {e.kanji}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${LEVEL_STYLES[e.level] || ''}`}>
                  {e.level}
                </span>
              </div>
              <p className="text-xs text-rose-600 mt-1.5">{e.furigana}</p>
              <p className="text-sm text-slate-600 mt-1 leading-snug">
                {e.onyomi?.length ? e.onyomi.join('/') : ''}
                {e.kunyomi?.length ? ' · ' + e.kunyomi.join('/') : ''}
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1.5 leading-snug">{e.meaning}</p>
              <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mt-2.5">
                <FlipVertical size={11} />
                Ketuk untuk flashcard
              </p>
            </button>
          ))}
        </div>
      )}

      {/* ===== Popup flashcard 3D ===== */}
      {openCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="w-full max-w-md animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white/90 tabular-nums">
                {openIndex + 1} / {filtered.length}
              </span>
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Tutup"
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <FlashcardCard key={openCard.id} card={kanjiToCard(openCard)} showFurigana />

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setOpenIndex((i) => Math.max(0, i - 1))}
                disabled={openIndex === 0}
                className="btn-ghost flex-1 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Prev
              </button>
              <button
                onClick={() => setOpenIndex((i) => Math.min(filtered.length - 1, i + 1))}
                disabled={openIndex >= filtered.length - 1}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}