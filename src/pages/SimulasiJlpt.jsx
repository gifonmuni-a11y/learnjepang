// Simulasi JLPT — timer + breakdown per kategori.
import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import kanaN5 from '../data/quiz/kana-n5.json'
import bunpouKotobaN5 from '../data/quiz/bunpou-kotoba-n5.json'
import kanjiN5 from '../data/quiz/kanji-n5.json'

const mapSimulasi = {
  'kana-n5': kanaN5,
  'bunpou-kotoba-n5': bunpouKotobaN5,
  'kanji-n5': kanjiN5,
}

export default function SimulasiJlpt() {
  const { module } = useParams()
  const { level } = useSearchParams()
  const questions = mapSimulasi[module] || kanaN5
  const qLevel = level || 'N5'

  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [started, setStarted] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => {
        timerRef.current -= 1
        setTimer(timerRef.current)
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [started])

  const [timer, setTimer] = useState(25 * 60)

  const start = () => {
    timerRef.current = setInterval(() => {
      timerRef.current -= 1
      setTimer(timerRef.current)
    }, 1000)
    setStarted(true)
  }

  const remainingMin = timer ? Math.floor(timer / 60) : 0
  const remainingSec = timer ? timer % 60 : 0

  if (!started) return (
    <div className="genkoyoshi-panel glass rounded-2xl p-8 text-center">
      <h2 className="font-display font-bold text-2xl text-washi">Simulasi JLPT {qLevel}</h2>
      <p className="text-washi-dim">Waktu: 25 menit</p>
      <button onClick={start} className="bg-ako-500 text-white px-6 py-3 rounded-xl text-sm">
        Mulai Simulasi
      </button>
    </div>
  )

  if (timer !== null && timer <= 0) {
    const acc = (score.correct / Math.max(1, score.total)) * 100
    return (
      <div className="genkoyoshi-panel glass rounded-2xl p-8 text-center">
        <p className="font-display font-bold text-2xl text-washi">Waktu habis!</p>
        <p className="text-washi-dim mb-4">Skor: {acc.toFixed(1)}%</p>
        <button
          onClick={() => setQIndex(0)}
          className="bg-ako-500 text-white px-6 py-3 rounded-xl text-sm hover:bg-ako-400 transition-colors"
        >
          Main Lagi
        </button>
      </div>
    )
  }

  const q = questions[qIndex]
  if (!q) return null

  const handleAnswer = (selected) => {
    const isCorrect = selected === q.answer
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    setQIndex((i) => i + 1)
  }

  return (
    <div className="min-h-screen bg-sumi-950">
      <header className="genkoyoshi-panel glass border-b border-washi/20 px-4 py-3">
        <h1 className="font-display font-extrabold text-2xl text-washi">
          Simulasi JLPT {qLevel}
        </h1>
        <div className="flex items-center gap-4">
          <p className="font-mono text-washi text-lg">
            {remainingMin}:{remainingSec < 10 ? '0' : ''}{remainingSec}
          </p>
        </div>
      </header>

      <section className="p-4 border-y border-washi/20">
        <p className="font-mono text-washi text-lg mb-4">{q.question}</p>
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="rounded-xl border border-washi/30 bg-sumi-800 text-washi text-sm py-3 hover:bg-sumi-700 transition-colors w-full"
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-washi-dim">Skor sementara: {score.correct}/{score.total}</p>
      </section>
    </div>
  )
}