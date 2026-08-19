import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Illustration from '../components/illustrations/Illustration'

export default function HiraganaKatakana() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('hiragana') // 'hiragana' | 'katakana'
  const [filter, setFilter] = useState('base')
  const { user } = useAuth()

  // Load data
  const [hiragana, setHiragana] = useState([])
  const [katakana, setKatakana] = useState([])

  useEffect(() => {
    ;(async () => {
      const h = await (import('../data/hiragana.json')).then((m) => m.default || m)
      const k = await (import('../data/katakana.json')).then((m) => m.default || m)
      setHiragana(h)
      setKatakana(k)
    })()
  }, [])

  const entries = type === 'hiragana' ? hiragana : katakana
  const isPartikel = (e) => {
  const p = ['は', 'が', 'を', 'に', 'へ', 'で', 'と', 'も', 'や', 'の', 'か', 'ね', 'よ', 'から', 'まで', 'だけ', 'しか', 'より']
  return p.includes(e.kanji)
}

const filtered = entries.filter(
    (e) =>
      (e.kanji + e.romaji + e.meaning + (e.mnemonicNote || '')).toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'base'
        ? !/[が-ん]/.test(e.kanji) && !/[ぱ-ん]/.test(e.kanji) && !isPartikel(e)
        : filter === 'dakuten'
        ? /[が-ん]/.test(e.kanji)
        : filter === 'handakuten'
        ? /[ぱ-ん]/.test(e.kanji)
        : filter === 'youon'
        ? /[アイウエオガギグゲゴ]/.test(e.kanji) || /[アアイウエオガギグゲゴ]/.test(e.kanji)
        : filter === 'gairaigo'
        ? /[パピプペポ]/.test(e.kanji) || /[パピプペポ]/.test(e.kanji)
        : filter === 'partikel'
        ? isPartikel(e)
        : true)
  )

  const handleSearch = (e) => setSearch(e.target.value)
  const handleTypeChange = (e) => {
    setType(e.target.value)
    setSearch('')
    setFilter('base')
  }
  const handleFilterChange = (e) => setFilter(e.target.value)

  return (
    <div className="min-h-screen bg-sumi-950">
      <header className="genkoyoshi-panel glass border-b border-washi/20 px-4 py-3">
        <h1 className="font-display font-extrabold text-2xl text-washi">
          Hiragana & Katakana
        </h1>
        <p className="text-washi-dim text-sm">
          {user ? `Selamat datang, ${user.email?.split('@')[0] ?? 'senpai'}` : 'Belajar hiragana & katakana'}
        </p>
      </header>

      <section className="p-4 border-y border-washi/20">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-washi-dim text-xs mb-1">Pilih modul</label>
            <select
              value={type}
              onChange={handleTypeChange}
              className="w-full rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-washi/30"
            >
              <option value="hiragana">Hiragana</option>
              <option value="katakana">Katakana</option>
            </select>
          </div>
          <div>
            <label className="block text-washi-dim text-xs mb-1">Filter</label>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-washi/30"
            >
              <option value="base">Dasar</option>
              <option value="dakuten">Dakuten/Tenten</option>
              <option value="handakuten">Handakuten</option>
              <option value="youon">Youon</option>
              <option value="gairaigo">Gairaigo</option>
              <option value="partikel">Partikel</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Cari kata kunci..."
            className="w-full rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 placeholder-washi-faint focus:outline-none focus:ring-2 focus:ring-washi/30 text-sm"
          />
        </div>
      </section>

      <section className="p-4 genkoyoshi-panel grid grid-cols-4 gap-3 overflow-x-auto">
        {filtered.map((e, i) => {
          const IllustrationKey = e.illustrationKey
          return (
            <div
              key={i}
              className="relative rounded-xl border bg-sumi-900 p-3 hover:border-washi/30 transition-colors group"
            >
              <Illustration
                illustrationKey={IllustrationKey}
                char={e.kanji}
                className="shrink-0"
                size={48}
              />
              <div className="flex flex-col flex-1 p-2">
                <p className="font-display font-bold text-washi truncate">{e.kanji}</p>
                <p className="text-washi-dim text-xs truncate">
                  {e.romaji || ''}
                </p>
              </div>
              <Illustration
                illustrationKey={IllustrationKey}
                char={e.kanji}
                className="absolute top-2 left-2 text-xs"
                size={20}
              />
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="col-span-4 text-center text-washi-dim">
            Tidak ada hasil. Coba filter atau kata kunci lain.
          </p>
        )}
      </section>
    </div>
  )
}