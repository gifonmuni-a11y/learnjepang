// Halaman Kuis — menampilkan soal gaya JLPT dari bank soal JSON.
// Menampilkan satu soal per halaman dengan opsi jawaban.
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Import soal per modul
import kanaN5 from '../data/quiz/kana-n5.json'
import bunpouKotobaN5 from '../data/quiz/bunpou-kotoba-n5.json'
import kanjiN5 from '../data/quiz/kanji-n5.json'
import kanaN4 from '../data/quiz/kana-n4.json'
import bunpouKotobaN4 from '../data/quiz/bunpou-kotoba-n4.json'
import kanjiN4 from '../data/quiz/kanji-n4.json'

const mapModule = {
  'hiragana-katakana/kana-n5': kanaN5,
  'hiragana-katakana/kana-n4': kanaN4,
  'bunpou-kotoba/bunpou-kotoba-n5': bunpouKotobaN5,
  'bunpou-kotoba/bunpou-kotoba-n4': bunpouKotobaN4,
  'kanji/kanji-n5': kanjiN5,
  'kanji/kanji-n4': kanjiN4,
}

export default function QuizPage() {
  const { module } = useParams()
  const { level } = useSearchParams()
  const questions = mapModule[module] || kanaN5 // fallback ke kana N5
  const qLevel = level || 'N5'

  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showResult, setShowResult] = useState(false)
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (qIndex >= questions.length) {
      setShowResult(true)
    }
  }, [qIndex])

  if (showResult) {
    const acc = (score.correct / Math.max(1, score.total)) * 100
    return (
      <div className="genkoyoshi-panel glass rounded-2xl p-8 text-center">
        <p className="font-display font-bold text-2xl text-washi">Selesai!</p>
        <p className="text-washi-dim mb-4">Skor: {acc.toFixed(1)}%</p>
        <button
          onClick={() => setQIndex(0)}
          className="bg-ako-500 text-white px-6 py-3 rounded-xl text-sm hover:bg-ako-400 transition-colors"
        >
          Main lagi
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
    setCurrent(isCorrect ? 'benar' : 'salah')
    // otomatis lanjut setelah 1 detik
    const timeout = setTimeout(() => {
      setQIndex((i) => i + 1)
      setCurrent(null)
    }, 1000)
    return () => clearTimeout(timeout)
  }

  return (
    <div className="min-h-screen bg-sumi-950">
      <header className="genkoyoshi-panel glass border-b border-washi/20 px-4 py-3">
        <h1 className="font-display font-extrabold text-2xl text-washi">Kuis JLPT {qLevel}</h1>
        <p className="text-washi-dim text-sm">Soal {qIndex + 1} dari {questions.length}</p>
      </header>

      <section className="p-4 border-y border-washi/20">
        <p className="font-mono text-washi text-lg mb-4">{q.question}</p>
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="rounded-xl border border-washi/30 bg-sumi-800 text-washi text-sm py-3 hover:bg-sumi-700 transition-colors w-full"
              disabled={showResult}
            >
              {opt}
            </button>
          ))}
        </div>
        {current && (
          <p className="mt-4 text-center">
            {current === 'benar' ? 'Jawaban benar!' : 'Jawaban salah.'}
          </p>
        )}
      </section>
    </div>
  )
}