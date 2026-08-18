import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Illustration from '../components/illustrations/Illustration'

// Pars bunpou
const parsePattern = (pattern) => {
  const clean = pattern.replace(/^~/, '~')
  return clean
}

// Kosakata theme filter
const filterByTheme = (entries, theme) => {
  if (!theme || theme === 'all') return entries
  return entries.filter((e) => e.theme === theme)
}

// Level filter
const filterByLevel = (entries, level) => {
  if (!level || level === 'all') return entries
  return entries.filter((e) => e.level === level)
}

export default function BunpouKotoba() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all') // 'all' | 'N5' | 'N4'
  const [theme, setTheme] = useState('all') // 'all' | semua theme dari data
  const { user } = useAuth()

  // Load data
  const [bunpou, setBunpou] = useState([])
  const [kotoba, setKotoba] = useState([])

  useEffect(() => {
    ;(async () => {
      const bp = await (import('../data/bunpou.json')).then((m) => m.default || m)
      const kb = await (import('../data/kotoba.json')).then((m) => m.default || m)
      setBunpou(bp)
      setKotoba(kb)
    })()
  }, [])

  // Temukan semua tema unik dari kotoba
  const allThemes = [...new Set(kotoba.map((e) => e.theme))].sort()

  const filteredBunpou = filterByLevel(
    bunpou.filter(
      (e) =>
        (e.pattern + e.explanation + (e.meaning || '')).toLowerCase().includes(
          search.toLowerCase()
        )
    ),
    level
  )
  const filteredKotoba = filterByTheme(
    filterByLevel(
      kotoba.filter(
        (e) =>
          (e.word + e.reading + e.romaji + e.meaning).toLowerCase().includes(
            search.toLowerCase()
          )
      ),
      level
    ),
    theme
  )

  const handleSearch = (e) => setSearch(e.target.value)
  const handleLevelChange = (e) => {
    setLevel(e.target.value)
    setSearch('')
    setTheme('all')
  }
  const handleThemeChange = (e) => setTheme(e.target.value)

  return (
    <div className="min-h-screen bg-sumi-950">
      <header className="genkoyoshi-panel glass border-b border-washi/20 px-4 py-3">
        <h1 className="font-display font-extrabold text-2xl text-washi">
          Bunpou & Kotoba
        </h1>
        <p className="text-washi-dim text-sm">
          {user ? `Selamat datang, ${user.email?.split('@')[0] ?? 'senpai'}` : 'Tata bahasa & kosakata'}
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
            <label className="block text-washi-dim text-xs mb-1">Tema</label>
            <select
              value={theme}
              onChange={handleThemeChange}
              className="w-full rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-washi/30"
            >
              <option value="all">Semua tema</option>
              {allThemes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Cari pola/ kata..."
            className="w-full rounded-xl border border-washi/30 bg-sumi-800 text-washi py-2 px-3 placeholder-washi-faint focus:outline-none focus:ring-2 focus:ring-washi/30 text-sm"
          />
        </div>
      </section>

      <section className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Bunpou */}
          <div>
            <h2 className="font-display font-bold text-washi text-sm mb-3">Grammar</h2>
            {filteredBunpou.length === 0 ? (
              <p className="text-washi-dim">Tidak ada hasil</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredBunpou.map((e, i) => (
                  <div
                    key={e.id}
                    className="rounded-xl border bg-sumi-900 p-3 hover:border-washi/30 transition-colors"
                  >
                    <p className="font-display font-bold text-washi text-sm truncate">{parsePattern(
                      e.pattern
                    )}</p>
                    <p className="text-washi-dim text-xs truncate">{e.meaning || ''}</p>
                    <p className="text-washi-dim text-xxs">
                      {e.explanation || ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kotoba */}
          <div>
            <h2 className="font-display font-bold text-washi text-sm mb-3">Kosakata</h2>
            {filteredKotoba.length === 0 ? (
              <p className="text-washi-dim">Tidak ada hasil</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredKotoba.map((e, i) => (
                  <div
                    key={e.id}
                    className="rounded-xl border bg-sumi-900 p-3 hover:border-washi/30 transition-colors"
                  >
                    <p className="font-display font-bold text-washi text-sm truncate">
                      {e.word}
                    </p>
                    <p className="text-washi-dim text-xs">
                      {e.reading} ({e.romaji})
                    </p>
                    <p className="text-washi-dim text-xxs">{e.meaning}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}