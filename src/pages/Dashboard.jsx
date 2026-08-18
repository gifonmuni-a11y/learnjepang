import { Link } from 'react-router-dom'
import { Type, BookOpen, KanbanSquare, ScrollText, Layers, PenLine, FileQuestion, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import LevelBadge from '../components/ui/LevelBadge'

const modules = [
  {
    to: '/hiragana-katakana',
    name: 'Hiragana & Katakana',
    jp: 'かな',
    desc: '46 huruf dasar, dakuten, youon, dan partikel',
    icon: Type,
    accent: 'text-aka-400 border-aka-500/40',
    badge: null
  },
  {
    to: '/bunpou-kotoba',
    name: 'Bunpou & Kotoba',
    jp: 'ぶんぽう・ことば',
    desc: 'Tata bahasa dan kosakata N5-N4',
    icon: BookOpen,
    accent: 'text-ao-400 border-ao-500/40',
    badge: 'N5'
  },
  {
    to: '/kanji',
    name: 'Kanji',
    jp: 'かんじ',
    desc: '103 kanji N5 + kanji N4 lengkap',
    icon: KanbanSquare,
    accent: 'text-kin-400 border-kin-500/40',
    badge: 'N5'
  },
  {
    to: '/hafalan',
    name: 'Hafalan Custom',
    jp: 'じぶんのカード',
    desc: 'Buat deck flashcard kamu sendiri',
    icon: ScrollText,
    accent: 'text-wasabi-400 border-wasabi-500/40',
    badge: null
  }
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-fade-up">
      <section className="genkoyoshi-panel glass rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 hanko text-aka-500 opacity-15 text-6xl p-4 select-none pointer-events-none">
          学
        </div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-washi-faint mb-2">KONNICHIWA</p>
        <h1 className="font-display font-extrabold text-xl leading-snug text-washi">
          {user ? `Selamat belajar, ${user.email?.split('@')[0] ?? 'senpai'}` : 'Belajar bahasa Jepang'}
        </h1>
        <p className="text-sm text-washi-dim mt-2 leading-relaxed max-w-md">
          Level N5 sampai N4. Kana, bunpou, kotoba, kanji, flashcard ber-SRS, dan latihan soal gaya JLPT.
        </p>
        <div className="flex gap-2 mt-4">
          <LevelBadge level="N5" />
          <LevelBadge level="N4" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-washi text-sm tracking-wide">MODUL BELAJAR</h2>
          <Link to="/simulasi-jlpt" className="text-xs font-semibold text-aka-400 flex items-center gap-1">
            Simulasi JLPT
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="glass rounded-2xl p-4 flex items-center gap-4 transition-transform active:scale-[0.98] hover:border-washi/20"
            >
              <div
                className={`h-11 w-11 shrink-0 rounded-xl border bg-sumi-900 flex items-center justify-center ${m.accent}`}
              >
                <m.icon size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-washi text-sm truncate">{m.name}</h3>
                  {m.badge && <LevelBadge level={m.badge} />}
                </div>
                <p className="font-mono text-[10px] text-washi-faint mt-0.5">{m.jp}</p>
                <p className="text-xs text-washi-dim mt-0.5 truncate">{m.desc}</p>
              </div>
              <ChevronRight size={16} className="text-washi-faint shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-4">
        <h2 className="font-display font-bold text-washi text-sm tracking-wide mb-3">MODE BELAJAR</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Materi', icon: Layers, desc: 'Baca & cari' },
            { label: 'Flashcard', icon: PenLine, desc: 'Hafal & ulang' },
            { label: 'Kuis', icon: FileQuestion, desc: 'Uji diri' }
          ].map((mode) => (
            <div key={mode.label} className="rounded-xl border border-washi/10 bg-sumi-900 p-3 text-center">
              <mode.icon size={16} className="mx-auto text-washi-dim" strokeWidth={1.8} />
              <p className="text-xs font-semibold text-washi mt-1.5">{mode.label}</p>
              <p className="font-mono text-[9px] text-washi-faint mt-0.5">{mode.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {!user && (
        <Link
          to="/login"
          className="block text-center text-sm font-semibold text-aka-400 py-3 border border-aka-500/40 rounded-xl hover:bg-aka-500/10 transition-colors"
        >
          Masuk untuk menyimpan progress
        </Link>
      )}
    </div>
  )
}