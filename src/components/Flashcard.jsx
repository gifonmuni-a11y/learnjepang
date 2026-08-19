// Flashcard reusable: flip, swipe, TTS, rating, progress.
// Props:
// cards: array { id, front: {char, romaji, illustration?, mnemonic?}, back: {word, reading, readingRomaji, meaning, illustration?, example?} }
// onRate(cardId, rating): opsional — menyimpan state SRS ke Supabase/localStorage
// showIllustration: boolean — tampilkan ilustrasi di kanan depanya
// canvasMode: boolean — tampilkan CanvasWrite di belakang
// ttsText: string | null — teks untuk TTS saat tombol ditekan
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { speakJapanese } from '../lib/tts'
import { saveSrsState, loadSrsStates } from '../lib/progress'
import Illustration from '../components/illustrations/Illustration'
import { RATINGS } from '../lib/srs'

const SWIPE_THRESHOLD = 50

export default function Flashcard({
  cards,
  onRate,
  showIllustration = true,
  canvasMode = false,
  ttsText = null
}) {
  const { user } = useAuth()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [rating, setRating] = useState(null)
  const [showTTS, setShowTTS] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDue, setIsDue] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [srsState, setSrsState] = useState(null)

  const card = cards[index]
  if (!card) return null

  // Load SRS state dari Supabase / localStorage berdasarkan cardType (dari wrapper) dan id kartu
  useEffect(() => {
    ;(async () => {
      const cardType = cards._cardType || 'unknown'
      const stored = await loadSrsStates(user && user.id ? user.id : null, cardType)
      const st = stored[card.id] || null
      setSrsState(st)
      setIsDue(st ? !st.nextReviewDate || st.nextReviewDate <= new Date().toISOString().slice(0, 10) : true)
    })()
  }, [user && user.id, index, cards._cardType])

  // Compute progress: berapa kartu yang sudah direview total di session ini
  const totalCards = cards.length
  const reviewed = totalCards // ringkas: progress total berdasarkan pada total cards di array

  // Saturate progress 0-100
  const computedProgress = Math.round((reviewed / Math.max(1, totalCards)) * 100)

  // Due count
  setProgress(computedProgress)

  // Toggle flip
  const toggleFlip = () => {
    if (isLoading) return
    setFlipped(!flipped)
  }

  // Swipe handlers
  const pointer = useRef({ x: 0, isDown: false })

  useEffect(() => {
    const handlePointerDown = (e) => {
      e.preventDefault()
      pointer.current = { x: e.clientX, isDown: true }
    }
    const handlePointerMove = (e) => {
      if (!pointer.current.isDown) return
      e.preventDefault()
      const dx = e.clientX - pointer.current.x
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        // swipe kanan = sudah hafal (rating 3), swipe kiri = belum (rating 0)
        pointer.current.isDown = false
        setFlipped(false)
        setRating(dx > 0 ? 3 : 0)
        if (onRate) {
          setIsLoading(true)
          ;(async () => {
            await onRate(card.id, rating)
            setIsLoading(false)
            setIndex((i) => i + 1 < totalCards ? i + 1 : i)
            setFlipped(false)
            setRating(null)
          })()
        } else {
          setIndex((i) => i + 1 < totalCards ? i + 1 : i)
          setFlipped(false)
        }
      }
    }
    const handlePointerUp = () => {
      pointer.current.isDown = false
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [onRate, totalCards])

  // TTS
  const handleTTS = async () => {
    if (!ttsText || isLoading) return
    setShowTTS(true)
    try {
      await speakJapanese(ttsText)
    } catch (e) {
      // fallback silently
    } finally {
      setShowTTS(false)
    }
  }

  // Jika sudah semua card pernah direview (rating pernah diberikan), tampilkan selesai
  const allReviewed = totalCards > 0 && rating !== null // setiap kali rating berubah

  // Jika semua sudah direview dan index terakhir, tampilkan selesai
  if (allReviewed && index >= totalCards - 1 && rating !== null) {
    return (
      <div className="genkoyoshi-panel glass rounded-2xl p-8 text-center">
        <p className="font-display font-bold text-washi text-3xl mb-4">Yay!</p>
        <p className="text-washi-dim mb-6">Kartu ini sudah kamu hafal!</p>
        <button
          onClick={() => setIndex((i) => i + 1 < totalCards ? i + 1 : i)}
          className="bg-aka-500 text-white px-6 py-3 rounded-xl text-sm hover:bg-aka-400 transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    )
  }

  // Jika SRS due, tampilkan tulisan "Sudah Jatuh Tempo"
  const dueLabel = isDue ? (
    <p className="genkoyoshi-panel text-washi-faint text-xs uppercase mb-3">
      Jatuh tempo
    </p>
  ) : null

  // Render belakang
  const renderBack = () => {
    if (canvasMode) {
      return (
        <CanvasWrite
          onDone={() => setShowCanvas(false)}
        />
      )
    }
    if (card.back) {
      const { word, reading, readingRomaji, meaning, example, illustration } = card.back
      return (
        <div className="p-6 space-y-4">
          <h3 className="font-display font-bold text-washi text-lg">{word}</h3>
          <p className="font-mono text-washi text-sm">{readingRomaji || reading}</p>
          {illustration && <Illustration illustrationKey={illustration} char={word} className="mt-2" size={32} />}
          <p className="text-washi-dim text-sm">{meaning}</p>
          {example && (
            <p className="italic text-washi-dim text-sm">
              {example.jp} — {example.id}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Render depan
  const renderFront = () => {
    if (!card.front) return null
    const { char, romaji, illustration, mnemonic } = card.front
    return (
      <div className="genkoyoshi-panel glass rounded-2xl p-6 relative overflow-hidden">
        <span
          className="absolute top-3 right-3 text-xs text-washi-faint"
          onClick={toggleFlip}
          aria-label="Flip card"
        >
          ⇅
        </span>
        <div className="relative flex flex-col items-center gap-4">
          <div className="text-5xl font-display font-bold text-washi">{char}</div>
          {romaji && <p className="text-washi-dim text-sm">romaji: {romaji}</p>}
          {mnemonic && <p className="text-washi-dim text-xs">mnemonic: {mnemonic}</p>}
          {showIllustration && illustration && (
            <Illustration illustrationKey={illustration} char={char} className="mt-3" size={40} />
          )}
        </div>
        {/* Rating bar after flip */}
        {flipped && rating !== null && (
          <div className="flex justify-center gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRating(r.value)}
                className={`inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-sm ${
                  rating === r.value
                    ? 'bg-washi-200 text-aka-600'
                    : 'text-washi-faint border border-washi/30 hover:bg-sumi-700/30 transition-colors'
                }`}
                aria-label={`Rating: ${r.label}`}
              >
                <span className={`tone-${r.tone}`} aria-label={`Rating tone ${r.label}`}>&#8203;</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        )}
        {/* TTS button */}
        {ttsText && (
          <button
            onClick={handleTTS}
            className="mt-2 rounded-xl border border-washi/30 bg-sumi-800 text-washi text-xs py-1.5 hover:bg-sumi-700 transition-colors"
            aria-label="Dengar pembacaan Jepang"
          >
            🔊 TTS
          </button>
        )}
      </div>
    )
  }

  // Count remaining
  const remaining = totalCards - index

  return (
    <div className="min-h-[480px] space-y-6">
      <header className="genkoyoshi-panel glass rounded-2xl p-5 border-y border-washi/20">
        <h2 className="font-display font-bold text-washi text-xl">
          {card.jp || card.front?.char || 'Flashcard'}
        </h2>
        <p className="text-washi-dim text-sm">
          Sisa: {remaining} kartu · Progress: {computedProgress}%
        </p>
      </header>

      {dueLabel}

      <section className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-2xl">
          {renderFront()}
          {flipped && renderBack()}
        </div>
      </section>

      {showCanvas && <CanvasWrite onDone={() => setShowCanvas(false)} />}

      <footer className="genkoyoshi-panel glass rounded-2xl p-5 border-y border-washi/20">
        <div className="flex gap-3">
          <button
            onClick={toggleFlip}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-washi/30 bg-sumi-800 text-washi text-xs py-1.5 hover:bg-sumi-700 transition-colors"
            aria-label={flipped ? 'Kembali ke depan' : 'Flip card'}
          >
            {flipped ? 'Depan' : 'Belakang'}
          </button>
          {flipped && rating === null && (
            <button
              onClick={() => setRating(1)}
              className="flex-1 rounded-xl border bg-ako-500/10 text-ako-400 text-xs py-1.5 hover:bg-ako-500/20 transition-colors"
              aria-label="Susah"
            >
              Susah
            </button>
          )}
          {flipped && rating === null && (
            <button
              onClick={() => setRating(2)}
              className="flex-1 rounded-xl border bg-ao-500/10 text-ao-400 text-xs py-1.5 hover:bg-ao-500/20 transition-colors"
              aria-label="Biasa"
            >
              Biasa
            </button>
          )}
          {flipped && rating === null && (
            <button
              onClick={() => setRating(3)}
              className="flex-1 rounded-xl border bg-wasabi-500/10 text-wasabi-400 text-xs py-1.5 hover:bg-wasabi-500/20 transition-colors"
              aria-label="Gampang"
            >
              Gampang
            </button>
          )}
        </div>
        {flipped && rating !== null && (
          <p className="text-washi-dim text-xs mt-2">
            Terima kasih! Rating disimpan.
          </p>
        )}
      </footer>
    </div>
  )
}