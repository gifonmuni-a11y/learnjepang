// ============================================================
// FlashcardCard — satu kartu flashcard (depan + belakang).
// Desain mengikuti spesifikasi:
//  - Depan : char besar (mincho), furigana_atas di atas, arti
//            ID (tebal) + EN (abu) di tengah bawah, kun/on-yomi
//            italic di kiri bawah.
//  - Belakang: grid 2 kolom x 4 baris (max 8 kosakata), tiap sel
//            furigana (merah, hide-able) / kanji (bold) / arti.
// Props: card (schema cardSchema.js), showFurigana (bool)
// ============================================================
import { useState, useCallback } from 'react'
import { padVocab } from '../lib/cardSchema'

function FuriganaText({ text, show }) {
  if (!show || !text) return null
  return <div className="text-[13px] leading-tight text-rose-600">{text}</div>
}

// Ukuran huruf depan menyesuaikan panjang kata:
// kanji tunggal besar, kata panjang mengecil agar muat.
function frontFontSize(char = '') {
  const n = char.length
  if (n <= 1) return 'clamp(96px, 20vw, 150px)'
  if (n <= 3) return 'clamp(64px, 14vw, 96px)'
  if (n <= 6) return 'clamp(44px, 10vw, 68px)'
  return 'clamp(30px, 7vw, 48px)'
}

export default function FlashcardCard({ card, showFurigana = true }) {
  const [flipped, setFlipped] = useState(false)
  const vocab = padVocab(card.kosakata)

  const flip = useCallback(() => setFlipped((f) => !f), [])

  return (
    <div className="perspective-1000 w-full select-none" onClick={flip}>
      <div
        className={`relative w-full h-[460px] sm:h-[500px] transition-transform duration-600 ease-in-out preserve-3d cursor-pointer ${
          flipped ? 'rotate-y-180' : ''
        }`}
        style={{ transitionDuration: '600ms' }}
      >
        {/* ===== SISI DEPAN ===== */}
        <div className="absolute inset-0 backface-hidden card-base flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4">
            <FuriganaText text={card.furigana_atas} show={showFurigana} />
            <div
              className="font-display leading-none text-slate-900 mt-1 text-center break-keep"
              style={{
                fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif',
                fontSize: frontFontSize(card.char)
              }}
            >
              {card.char}
            </div>
          </div>

          <div className="text-center pb-8">
            <div className="text-2xl font-bold text-slate-800">{card.arti_id}</div>
            {card.arti_en && (
              <div className="text-base font-medium text-slate-500 mt-1">{card.arti_en}</div>
            )}
          </div>

          <div className="px-6 pb-5 pt-3 border-t border-slate-200 text-left space-y-1">
            <p className="text-sm text-slate-600 italic">
              Kun-yomi : <span className="font-medium">{card.kunyomi || '-'}</span>
            </p>
            <p className="text-sm text-slate-600 italic">
              On-yomi : <span className="font-medium">{card.onyomi || '-'}</span>
            </p>
          </div>
        </div>

        {/* ===== SISI BELAKANG ===== */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 card-base overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-4 h-full w-full">
            {vocab.map((v, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center text-center px-2 py-1
                  border-slate-200 ${i % 2 === 0 ? 'border-r' : ''}
                  ${i < 6 ? 'border-b' : ''}`}
              >
                {showFurigana && v.furigana && (
                  <div className="text-xs text-rose-600 mb-0.5 min-h-[16px] leading-tight">
                    {v.furigana}
                  </div>
                )}
                {!showFurigana && <div className="min-h-[16px]" />}
                <div
                  className="text-2xl font-bold text-slate-900 leading-tight"
                  style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif' }}
                >
                  {v.kanji}
                </div>
                <div className="text-sm text-slate-600 leading-tight mt-1">{v.arti}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}