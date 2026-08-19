// Hafalan — review kartu deck tertentu.
import { useState, useEffect, useParams } from 'react'
import { useAuth } from '../hooks/useAuth'
import { loadDeckCards } from '../lib/hafalan'
import Flashcard from '../components/Flashcard'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export default function HafalanReview() {
  const { deckId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Always call hooks at top level
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (user && deckId) {
        const d = await loadDeckCards(user.id, deckId)
        setCards(d || [])
      }
    })()
  }, [user.id, deckId])

  const card = cards[index]
  if (!card) return null

  const total = cards.length

  const handleRate = async (r) => {
    ;(async () => {
      const cardType = 'custom'
      await (await import('../lib/progress')).saveSrsState(
        user.id,
        cardType,
        card.id,
        { easeFactor: 2.5, intervalDays: 0, repetitions: r, nextReviewDate: null, lastReviewedAt: new Date().toISOString() }
      )
    })()
    setIndex((i) => i + 1 < total ? i + 1 : i)
  }

  if (cards.length === 0) return (
    <div className="genkoyoshi-panel glass rounded-2xl p-8 text-center">
      <p className="text-washi-dim">Deck ini masih kosong.</p>
      <Button variant="ghost" onClick={() => navigate('/hafalan/buat')}>
        Buat Deck
      </Button>
    </div>
  )

  return (
    <Flashcard
      cards={cards}
      onRate={handleRate}
      showIllustration={true}
      canvasMode={false}
      ttsText={card.front?.char || null}
    />
  )
}