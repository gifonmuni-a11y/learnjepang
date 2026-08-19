// ============================================================
// FlashcardPage — mode belajar flashcard lengkap.
// Mode:
//  1. preset  : kartu kosakata (kanji/kana/kotoba) + library
//  2. materi  : kartu materi bunpou & partikel (layout alternatif)
//  3. custom  : kartu kosakata buatan sendiri (form 8 slot)
// Fitur: toggle furigana, swipe, prev/next, counter, progress.
// ============================================================
import { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { Eye, EyeOff, BookOpen, PenLine, BookMarked, ChevronLeft, ChevronRight } from 'lucide-react'
import FlashcardCard from '../components/FlashcardCard'
import MaterialFlashcard from '../components/MaterialFlashcard'
import CustomDeckForm from '../components/CustomDeckForm'
import { PRESET_LIBRARIES } from '../lib/cardBuilder'
import { MATERIAL_LIBRARIES } from '../lib/materialBuilder'
import { VOCAB_SLOTS } from '../lib/cardSchema'

const MODES = [
  { id: 'preset', label: 'Kosakata', icon: BookOpen },
  { id: 'materi', label: 'Materi', icon: BookMarked },
  { id: 'custom', label: 'Custom Deck', icon: PenLine }
]

export default function FlashcardPage() {
  const [mode, setMode] = useState('preset')
  const [presetId, setPresetId] = useState('kanji-n5')
  const [materiId, setMateriId] = useState('bunpou-n5')
  const [showFurigana, setShowFurigana] = useState(true)
  const [index, setIndex] = useState(0)
  const [customCards, setCustomCards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hwlearn:custom-deck') || '[]')
    } catch {
      return []
    }
  })

  const presetDeck = useMemo(() => {
    const lib = PRESET_LIBRARIES.find((l) => l.id === presetId)
    return lib ? lib.build() : []
  }, [presetId])

  const materiDeck = useMemo(() => {
    const lib = MATERIAL_LIBRARIES.find((l) => l.id === materiId)
    return lib ? lib.build() : []
  }, [materiId])

  const deck = mode === 'materi' ? materiDeck : mode === 'preset' ? presetDeck : customCards
  const current = deck[index]

  useEffect(() => {
    localStorage.setItem('hwlearn:custom-deck', JSON.stringify(customCards))
  }, [customCards])

  const switchMode = useCallback((m) => {
    setMode(m)
    setIndex(0)
  }, [])

  const switchPreset = useCallback((id) => {
    setPresetId(id)
    setIndex(0)
  }, [])

  const switchMateri = useCallback((id) => {
    setMateriId(id)
    setIndex(0)
  }, [])

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, deck.length - 1))
  }, [deck.length])

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  // ===== Swipe gesture =====
  const startX = useRef(null)
  const dragging = useRef(false)

  const onPointerDown = (e) => {
    dragging.current = true
    startX.current = e.clientX
  }
  const onPointerUp = (e) => {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - (startX.current ?? e.clientX)
    if (dx < -50) goNext()
    else if (dx > 50) goPrev()
  }

  const saveCard = useCallback((card) => {
    setCustomCards((prev) => [...prev, card])
    setMode('custom')
    setIndex((prev) => prev + 1)
  }, [])

  const activePreset = PRESET_LIBRARIES.find((l) => l.id === presetId)
  const activeMateri = MATERIAL_LIBRARIES.find((l) => l.id === materiId)

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-24 pt-6 animate-fade-up">
      {/* ===== Header Controls ===== */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setShowFurigana((v) => !v)}
          className={showFurigana ? 'chip' : 'chip-active'}
          aria-pressed={showFurigana}
        >
          {showFurigana ? <Eye size={14} /> : <EyeOff size={14} />}
          Furigana
        </button>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={mode === m.id ? 'chip-active' : 'chip'}
          >
            <m.icon size={14} />
            {m.label}
          </button>
        ))}
      </div>

      {/* ===== Pilih library ===== */}
      {mode === 'preset' && (
        <div className="flex gap-2 flex-wrap mb-5">
          {PRESET_LIBRARIES.map((lib) => (
            <button
              key={lib.id}
              onClick={() => switchPreset(lib.id)}
              className={presetId === lib.id ? 'chip-active' : 'chip'}
              title={lib.desc}
            >
              {lib.label}
            </button>
          ))}
        </div>
      )}
      {mode === 'materi' && (
        <div className="flex gap-2 flex-wrap mb-5">
          {MATERIAL_LIBRARIES.map((lib) => (
            <button
              key={lib.id}
              onClick={() => switchMateri(lib.id)}
              className={materiId === lib.id ? 'chip-active' : 'chip'}
              title={lib.desc}
            >
              {lib.label}
            </button>
          ))}
        </div>
      )}

      {/* ===== Kartu ===== */}
      {deck.length === 0 ? (
        <div className="card-base p-10 text-center text-slate-500">
          <p className="font-semibold">Belum ada kartu</p>
          {mode === 'custom' && (
            <p className="text-sm mt-2">Gunakan form di bawah untuk menambah kartu pertama.</p>
          )}
        </div>
      ) : (
        <>
          <div
            className="touch-pan-y"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {mode === 'materi' ? (
              <MaterialFlashcard
                key={current.id}
                card={current}
                showFurigana={showFurigana}
                index={index}
                total={deck.length}
              />
            ) : (
              <FlashcardCard key={current.id} card={current} showFurigana={showFurigana} />
            )}
          </div>

          {/* ===== Navigasi + counter ===== */}
          <div className="flex items-center justify-between mt-5 gap-3">
            <button onClick={goPrev} disabled={index === 0} className="btn-ghost flex-1" aria-label="Kartu sebelumnya">
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="text-sm font-bold text-slate-600 tabular-nums whitespace-nowrap">
              {index + 1} / {deck.length}
            </span>
            <button onClick={goNext} disabled={index >= deck.length - 1} className="btn-primary flex-1" aria-label="Kartu berikutnya">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-3">
            {mode === 'materi'
              ? activeMateri?.desc
              : mode === 'preset'
                ? activePreset?.desc
                : 'Deck custom'}
            {mode === 'materi' ? ' — tap kartu untuk membuka materi, gulir contoh untuk baca' : ' — tap kartu untuk balik'}
          </p>
        </>
      )}

      {/* ===== Form custom deck ===== */}
      {mode === 'custom' && <CustomDeckForm onSave={saveCard} onClose={() => switchMode('preset')} />}

      {mode === 'custom' && (
        <p className="text-center text-[10px] text-slate-400 mt-4">
          Sisi belakang menampilkan maks. {VOCAB_SLOTS} kosakata
        </p>
      )}
    </div>
  )
}