// Hafalan — buat deck baru + import JSON.
import { useState, useNavigate } from 'react'
import { useAuth } from '../hooks/useAuth'
import { parseImport } from '../lib/hafalan'
import Button from '../components/ui/Button'

export default function HafalanBuat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [deckName, setDeckName] = useState('')
  const [importError, setImportError] = useState('')

  const handleCreate = async () => {
    if (!deckName.trim()) return
    if (user) {
      ;(async () => {
        const d = await (await import('../lib/hafalan')).createDeck(user.id, deckName)
        navigate(`/hafalan/card/${d.id}`)
      })()
    } else {
      // guest: buat deck lokal? atau minta login
      alert('Masuk terlebih dahulu untuk membuat deck')
    }
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const { deckName, cards } = parseImport(evt.target.result)
        setDeckName(deckName || '')
        // Simpan ke localStorage/Subsequently
        alert(`Terimport ${cards.length} kartu dari deck "${deckName}"`)
      } catch (_err) {
        setImportError('Format file tidak valid')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-sumi-950">
      <header className="genkoyoshi-panel glass border-b border-washi/20 px-4 py-3">
        <h1 className="font-display font-extrabold text-2xl text-washi">
          Buat Deck Hafalan
        </h1>
      </header>

      <section className="p-4 border-y border-washi/20">
        {user ? (
          <>
            <h2 className="font-display font-bold text-washi text-sm mb-3">Buat Deck Baru</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreate()
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="Nama deck (mis. Konkanji)"
                  className="rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 focus:outline-none focus:ring-2 focus:ring-washi/30 w-full"
                />
                <Button type="submit">Buat</Button>
              </div>
            </form>

            <h3 className="font-display font-bold text-washi text-sm mt-4">Atau import dari file JSON</h3>
            <p className="text-washi-dim text-xs mb-2">Format: {/* contoh sederhana */}</p>
            <input
              type="file"
              onChange={handleImport}
              className="mt-2 rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 w-full"
            />
            {importError && <p className="mt-2 text-red-500 text-xs">{importError}</p>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hafalan')}
            >
              Kembali ke Hafalan
            </Button>
          </>)
          : (
          <p className="text-washi-dim">
            Masuk terlebih dahulu.
          </p>
        )}
      </section>
    </div>
  )
}