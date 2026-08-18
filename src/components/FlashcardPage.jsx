// Halaman Flashcard — wrapper dengan data modul.
// Gunakan data JSON dari modul masing-masing. Set cardType untuk SRS sync.
import { useEffect } from 'react'
import Flashcard from '../components/Flashcard'
import { useSWRConfig } from 'react-query'

// Data contoh untuk hafalan kana (pakai id dari JSON)
const kanaCards = {
  _cardType: 'hiragana',
  cards: [
    { id: 'hg-001', front: { char: 'あ', romaji: 'a', illustration: 'antena', mnemonic: 'Misal: antenna mengejutkan' }, back: { word: 'あ', reading: 'a', readingRomaji: 'a', meaning: 'A', illustration: 'antena', example: { jp: 'あいさつ', reading: 'あいさつ', id: 'sapa' } } },
    { id: 'hg-002', front: { char: 'い', romaji: 'i', illustration: 'chopsticks', mnemonic: 'Misal: sumpit menunjuk' }, back: { word: 'い', reading: 'i', readingRomaji: 'i', meaning: 'I', illustration: 'chopsticks', example: { jp: 'いす', reading: 'いす', id: 'kursi' } } },
    // Sama bisa ditambah, tapi untuk demo cukup 2
  ]
}

const katakanaCards = {
  _cardType: 'katakana',
  cards: [
    { id: 'hg-003', front: { char: 'ア', romaji: 'A', illustration: 'antena', mnemonic: 'Misal: antenna mengejutkan' }, back: { word: 'ア', reading: 'A', readingRomaji: 'A', meaning: 'A', illustration: 'antena', example: { jp: 'アイスクリーム', reading: 'アイスクリーム', id: 'es krim' } } },
  ]
}

const FlashcardPage = () => {
  const { mutateAsync } = useSWRConfig()
  const cards = kanaCards // bisa ditukar berdasarkan route params

  return (
    <Flashcard
      cards={cards}
      onRate={(id, rating) => {
        ;(async () => {
          await mutateAsync(['srs', id], { easeFactor: rating === 3 ? 2.5 : 2.3 })
        })()
      }}
      showIllustration={true}
      canvasMode={false}
      ttsText={null}
    />
  )
}

export default FlashcardPage