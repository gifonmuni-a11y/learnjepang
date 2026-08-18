// CRUD deck hafalan custom — wajib login (sync Supabase + RLS).
import { supabase } from './supabase'

export async function loadDecks(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('custom_decks')
    .select('id, deck_name, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function loadDeckCards(userId, deckId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('custom_cards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createDeck(userId, deckName) {
  const { data, error } = await supabase
    .from('custom_decks')
    .insert({ user_id: userId, deck_name: deckName })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDeck(userId, deckId) {
  const { error } = await supabase.from('custom_decks').delete().eq('id', deckId).eq('user_id', userId)
  if (error) throw error
}

export async function addCard(userId, deckId, card) {
  const { error } = await supabase.from('custom_cards').insert({
    deck_id: deckId,
    main_text: card.main_text,
    furigana: card.furigana || null,
    onyomi: card.onyomi || null,
    kunyomi: card.kunyomi || null,
    meaning: card.meaning || null
  })
  if (error) throw error
}

export async function deleteCard(userId, cardId) {
  const { error } = await supabase.from('custom_cards').delete().eq('id', cardId)
  if (error) throw error
}

export function exportDeck(deck, cards) {
  const payload = {
    app: 'web-learnjepang',
    type: 'hafalan-deck',
    deck_name: deck.deck_name,
    cards: cards.map((c) => ({
      main_text: c.main_text,
      furigana: c.furigana,
      onyomi: c.onyomi,
      kunyomi: c.kunyomi,
      meaning: c.meaning
    }))
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${deck.deck_name.replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImport(text) {
  const data = JSON.parse(text)
  if (data.type !== 'hafalan-deck' || !Array.isArray(data.cards)) {
    throw new Error('Format file tidak dikenali')
  }
  const cards = data.cards
    .filter((c) => c && typeof c.main_text === 'string' && c.main_text.trim())
    .map((c) => ({
      main_text: c.main_text.trim(),
      furigana: (c.furigana || '').trim() || null,
      onyomi: (c.onyomi || '').trim() || null,
      kunyomi: (c.kunyomi || '').trim() || null,
      meaning: (c.meaning || '').trim() || null
    }))
  if (cards.length === 0) throw new Error('Tidak ada kartu valid di file')
  return { deckName: data.deck_name || 'Deck Import', cards }
}