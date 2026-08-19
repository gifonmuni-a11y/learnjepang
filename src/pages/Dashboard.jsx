import { Link } from 'react-router-dom'
import {
  FlipVertical,
  Type,
  KanbanSquare,
  BookOpen,
  Timer,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const stats = [
  { label: 'Kanji', value: '305', to: '/kanji' },
  { label: 'Kotoba', value: '918', to: '/bunpou-kotoba' },
  { label: 'Bunpou', value: '120', to: '/bunpou-kotoba' },
  { label: 'Kana', value: '231', to: '/kana' }
]

const modules = [
  {
    to: '/flashcard',
    name: 'Flashcard',
    jp: 'フラッシュカード',
    desc: 'Hafal kanji & kana dengan kartu flip, swipe, dan mode custom deck',
    icon: FlipVertical,
    accent: 'text-blue-600 bg-blue-50 border-blue-200',
    badge: 'INTI'
  },
  {
    to: '/kana',
    name: 'Kana',
    jp: 'かな',
    desc: 'Hiragana, katakana, dakuten, youon, dan partikel',
    icon: Type,
    accent: 'text-sky-600 bg-sky-50 border-sky-200',
    badge: null
  },
  {
    to: '/kanji',
    name: 'Kanji',
    jp: 'かんじ',
    desc: '305 kanji JLPT N5 + N4 lengkap dengan contoh kosakata',
    icon: KanbanSquare,
    accent: 'text-rose-600 bg-rose-50 border-rose-200',
    badge: 'N5-N4'
  },
  {
    to: '/bunpou-kotoba',
    name: 'Bunpou & Kotoba',
    jp: 'ぶんぽう・ことば',
    desc: '120 pola tata bahasa dan 918 kosakata dengan furigana',
    icon: BookOpen,
    accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badge: null
  }
]

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 space-y-6 animate-fade-up pt-2">
      {/* ===== Hero ===== */}
      <section className="card-base p-5 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-slate-100 select-none pointer-events-none font-display text-[120px] leading-none">
          学
        </div>
        <p className="text-[11px] font-semibold tracking-[0.25em] text-blue-600 uppercase mb-2">
          Konnichiwa
        </p>
        <h1 className="text-xl font-bold text-slate-900 leading-snug">
          {user ? `Selamat belajar, ${user.email?.split('@')[0] ?? 'senpai'}` : 'Belajar Bahasa Jepang'}
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-md">
          Kuasai JLPT N5 sampai N4: kana, kanji, bunpou, kotoba, dan flashcard interaktif ber-SRS.
        </p>
        <div className="flex gap-2 mt-4">
          <span className="chip">Level N5</span>
          <span className="chip">Level N4</span>
        </div>
      </section>

      {/* ===== Statistik ===== */}
      <section className="grid grid-cols-4 gap-2.5">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card-base p-3 text-center hover:shadow-lift transition-shadow">
            <div className="text-xl font-bold text-slate-800">{s.value}</div>
            <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{s.label}</div>
          </Link>
        ))}
      </section>

      {/* ===== Modul ===== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-700 tracking-wide">MODUL BELAJAR</h2>
          <Link to="/simulasi-jlpt" className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            Simulasi JLPT
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="card-base p-4 flex items-center gap-4 hover:shadow-lift transition-shadow active:scale-[0.99]"
            >
              <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${m.accent}`}>
                <m.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">{m.name}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{m.jp}</span>
                  {m.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Latihan ===== */}
      <section className="grid grid-cols-2 gap-3 pb-4">
        <Link to="/simulasi-jlpt" className="card-base p-4 hover:shadow-lift transition-shadow">
          <Timer size={20} className="text-blue-600 mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">Simulasi JLPT</h3>
          <p className="text-xs text-slate-500 mt-1">Latihan soal gaya ujian dengan timer 25 menit</p>
        </Link>
        <Link to="/flashcard" className="card-base p-4 hover:shadow-lift transition-shadow">
          <BarChart3 size={20} className="text-emerald-600 mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">Mode Custom</h3>
          <p className="text-xs text-slate-500 mt-1">Buat deck flashcard pribadi, simpan otomatis</p>
        </Link>
      </section>
    </div>
  )
}