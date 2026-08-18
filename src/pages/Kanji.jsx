import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Illustration from '../components/illustrations/Illustration'

export default function Kanji() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all') // 'all' | 'N5' | 'N4'
  const { user } = useAuth()

  const [kanji, setKanji] = useState([])

  useEffect(() => {
    ;(async () => {
      const k = await (import('../data/kanji.json')).then((m) => m.default || m)
      setKanji(k)
    })()
  }, [])

  const filtered = kanji.filter(
    (e) =>
      (e.kanji + e.meaning + (e.mnemonicNote || '')).toLowerCase().includes(
        search.toLowerCase()
      ) && (level === 'all' || e.level === level)
  )

  const handleSearch = (e) => setSearch(e.target.value)
  const handleLevelChange = (e) => {
    setLevel(e.target.value)
    setSearch('')
  }

  return (
    <div className="min-h-screen bg-sumi-950">
      <header className="genkoyoshi-panel glass border-b border-washi/20 px-4 py-3">
        <h1 className="font-display font-extrabold text-2xl text-washi">
          Kanji
        </h1>
        <p className="text-washi-dim text-sm">
          {user ? `Selamat datang, ${user.email?.split('@')[0] ?? 'senpai'}` : 'Kanji N5-N4'}
        </p>
      </header>

      <section className="p-4 border-y border-washi/20">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-washi-dim text-xs mb-1">Level</label>
            <select
              value={level}
              onChange={handleLevelChange}
              className="w-full rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-washi/30"
            >
              <option value="all">Semua level</option>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
            </select>
          </div>
          <div>
            <label className="block text-washi-dim text-xs mb-1">Cari</label>
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Kanji, baca, atau arti..."
              className="w-full rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 placeholder-washi-faint focus:outline-none focus:ring-2 focus:ring-washi/30 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="p-4 genkoyoshi-panel grid grid-cols-2 gap-3 overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="col-span-2 text-center text-washi-dim">
            Tidak ada kanji. Ubah filter.
          </p>
        ) : (
          filtered.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border bg-sumi-900 p-4 hover:border-washi/30 transition-colors"
            >
              <Illustration
                illustrationKey={e.illustrationKey}
                char={e.kanji}
                className="shrink-0"
                size={64}
              />
              <div className="flex-1 pl-4">
                <p className="font-display font-bold text-washi text-lg truncate">
                  {e.kanji}
                </p>
                <p className="text-washi-dim text-sm">
                  {e.onyomi?.length > 0 ? e.onyomi.join('/') : ''} {e.kunyomi?.length > 0 ? '/' + e.kunyomi.join('/') : ''}
                </p>
                <p className="text-washi-dim text-sm mt-1">
                  {e.meaning}
                </p>
                {e.examples && e.examples.length > 0 && (
                  <p className="text-washi-dim text-xxs mt-1">
                    {e.examples[0].word}: {e.examples[0].meaning}
                  </p>
                )}
                <p className="text-washi-faint text-xxs mt-2">
                  {e.mnemonicNote || '—'}
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}