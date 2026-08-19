// ============================================================
// MaterialFlashcard — layout alternatif untuk materi pembelajaran
// (bunpou & partikel), bukan sekadar kosakata.
//
// Depan  : badge kategori (color-coded) kiri atas, ikon SVG besar,
//          judul materi, subjudul pancingan kuis, progress bar.
// Belakang: kolom flex — judul, kotak rumus (bg beda + border
//          dashed), contoh penggunaan scrollable (overflow-y auto,
//          3 baris per item: furigana / jp bold / terjemahan ID).
//
// Flip 3D dimatikan saat user menyentuh/menggulir area "Contoh
// Penggunaan" pada sisi belakang (stopPropagation pada pointer).
// ============================================================
import { useState, useCallback, useRef } from 'react'
import {
  Hash,
  Zap,
  Sparkles,
  BookOpen,
  Puzzle,
  HelpCircle,
  ChevronDown
} from 'lucide-react'
import { CATEGORY_COLORS } from '../lib/materialSchema'

const CATEGORY_ICONS = {
  'Kata Kerja': Zap,
  'Kata Sifat': Sparkles,
  Partikel: Hash,
  'Tata Bahasa Dasar': BookOpen,
  'Kata Bantu': Puzzle
}

export default function MaterialFlashcard({ card, showFurigana = true, index = 0, total = 1 }) {
  const [flipped, setFlipped] = useState(false)
  const scrollRef = useRef(null)

  const flip = useCallback(() => setFlipped((f) => !f), [])

  // Event pointer di area contoh TIDAK boleh memicu flip kartu
  // (agar user bisa scroll contoh dengan nyaman).
  const swallow = (e) => e.stopPropagation()
  const swallowClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const color = CATEGORY_COLORS[card.category] || CATEGORY_COLORS['Tata Bahasa Dasar']
  const CategoryIcon = CATEGORY_ICONS[card.category] || HelpCircle
  const progress = total > 0 ? Math.min(1, (index + 1) / total) : 0

  return (
    <div className="perspective-1000 w-full select-none">
      <div
        className={`relative w-full h-[540px] sm:h-[580px] transition-transform ease-in-out preserve-3d cursor-pointer ${
          flipped ? 'rotate-y-180' : ''
        }`}
        style={{ transitionDuration: '600ms' }}
        onClick={flip}
      >
        {/* ===== SISI DEPAN ===== */}
        <div className="absolute inset-0 backface-hidden card-base flex flex-col overflow-hidden">
          {/* Badge kategori (pojok kiri atas) */}
          <div className="flex items-center justify-between px-5 pt-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${color.chip}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
              {card.category}
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest">
              {card.level === 'N4' ? 'N4' : 'N5'}
            </span>
          </div>

          {/* Ikon besar + judul + subjudul */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color.icon}18`, color: color.icon }}
            >
              <CategoryIcon size={34} strokeWidth={1.8} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{card.title}</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">{card.prompt}</p>
          </div>

          {/* Progress bar horizontal */}
          <div className="px-5 pb-5">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%`, backgroundColor: color.icon }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] font-semibold text-slate-400">
              <span>Progress materi</span>
              <span className="tabular-nums">
                {index + 1} / {total}
              </span>
            </div>
          </div>
        </div>

        {/* ===== SISI BELAKANG ===== */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 card-base flex flex-col overflow-hidden">
          {/* Bagian 1: Judul */}
          <div className="px-5 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 leading-tight">{card.title}</h3>
            <span
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${color.chip}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
              {card.category}
            </span>
          </div>

          {/* Bagian 2: Kotak rumus (bg beda + border dashed) */}
          <div className="px-5 pt-4">
            <div
              className="rounded-xl px-4 py-3 border-2 border-dashed"
              style={{ backgroundColor: `${color.icon}0d`, borderColor: `${color.icon}55` }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: color.icon }}>
                Rumus / Pola Kalimat
              </p>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{card.pattern}</p>
              {card.explanation && (
                <p className="text-xs text-slate-500 leading-relaxed mt-2">{card.explanation}</p>
              )}
            </div>
          </div>

          {/* Bagian 3: Contoh penggunaan (scrollable) */}
          <div className="flex-1 px-5 pt-3 pb-4 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Contoh Penggunaan
              </p>
              <ChevronDown size={14} className="text-slate-300" />
            </div>
            <div
              ref={scrollRef}
              onPointerDown={swallow}
              onPointerUp={swallow}
              onPointerCancel={swallow}
              onClick={swallowClick}
              onPointerMove={swallow}
              className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-3"
            >
              {card.examples.map((ex, i) => (
                <div key={i} className="pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                  {/* Baris 1: furigana */}
                  {showFurigana && ex.furigana && (
                    <div className="text-xs text-rose-600 mb-0.5">{ex.furigana}</div>
                  )}
                  {/* Baris 2: teks Jepang */}
                  <div
                    className="text-base font-bold text-slate-900 leading-relaxed"
                    style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif' }}
                  >
                    {ex.jp}
                  </div>
                  {/* Baris 3: terjemahan Indonesia */}
                  <div className="text-sm text-slate-600 leading-relaxed mt-0.5">{ex.id}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Gulir untuk melihat semua contoh — kartu tidak akan berputar saat scroll
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}