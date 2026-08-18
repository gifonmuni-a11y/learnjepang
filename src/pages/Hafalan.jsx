// Hafalan — halaman utama: daftar deck + CTA buat deck baru.
import { useState, useEffect, useNavigate } from 'react'
import { useAuth } from '../hooks/useAuth'
import { loadDecks, createDeck, parseImport } from '../lib/hafalan'
import Button from '../components/ui/Button'

export default function Hafalan() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [decks, setDecks] = useState([])
  const [creating, setCreating] = useState(false)
  const [newDeckName, setNewDeckName] = useState('')

  useEffect(() => {
    ;(async () => {
      if (user) {
        const d = await loadDecks(user.id)
        setDecks(d)
      }
    })()
  }, [user?.id])

  const handleCreate = async () => {
    if (!newDeckName.trim()) return
    setCreating(true)
    try {
      const d = await createDeck(user.id, newDeckName)
      setDecks((prev) => [...prev, d])
      setNewDeckName('')
      setCreating(false)
      navigate(`/hafalan/card/${d.id}`)
    } catch (e) {
      setCreating(false)
    }
  }

  const handleImport = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (!file) return
    const text = await file.text()
    try {
      const { deckName, cards } = await parseImport(text)
      // Simpan ke deck baru
      const d = await createDeck(user.id, deckName)
      // Tambahkan kartu - implementasi sederhana
      for (const c of cards) {
        await addCard(user.id, d.id, c)
      }
      setDecks((prev) => [...prev, d])
      setNewDeckName('')
      e.target.value = '' // reset input
    } catch (err) {
      // show error
    }
  }

  return (
    <div className="min-h-screen bg-sumi-950">
      <header className="genkoyoshi-panel glass border-b border-washi/20 px-4 py-3">
        <h1 className="font-display font-extrabold text-2xl text-washi">
          Hafalan Custom
        </h1>
        <p className="text-washi-dim text-sm">
          {user ? `Selamat datang, ${user.email?.split('@')[0] ?? 'senpai'}` : 'Masuk untuk menyimpan deck'}
        </p>
      </header>

      <section className="p-4 border-y border-washi/20">
        {user ? (
          <>
            <h2 className="font-display font-bold text-washi text-sm mb-3">Deckku</h2>
            {decks.length === 0 ? (
              <p className="text-washi-dim">Belum ada deck. Buat deck baru di bawah.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {decks.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-xl border bg-sumi-900 p-3 hover:border-washi/30 transition-colors"
                  >
                    <p className="font-display font-bold text-washi text-sm truncate">
                      {d.deck_name}
                    </p>
                    <p className="text-washi-dim text-xs">
                      {d.cards?.length || 0} kartu
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/hafalan/card/${d.id}`)}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreate()
              }}
              className="mt-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Nama deck"
                  className="rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 focus:outline-none focus:ring-2 focus:ring-washi/30 w-full"
                />
                <Button type="submit" disabled={creating}>
                  {creating ? 'Membuat...' : 'Buat Deck'}
                </Button>
              </div>
            </form>
          </>)
          : (
          <p className="text-washi-dim">
            Masuk terlebih dahulu untuk membuat deck hafalan.
          </p>
        )}
      </section>
    </div>
  )
}

// Fungsi bantuan: tambah card ke deck (butuh implementasi supabase)
const addCard = async (userId, deckId, card) => {
  // placeholder - implementasi sebenarnya di hafalan.js
  try {
    await fetch(`/api/hafalan/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, deckId, card })
    })
  } catch (e) {
    console.error('Gagal menambah card', e)
  }
}