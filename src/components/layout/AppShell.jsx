import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutGrid, Type, KanbanSquare, BookOpen, FlipVertical, Timer } from 'lucide-react'
import Logo from '../ui/Logo'

const nav = [
  { to: '/', label: 'Beranda', icon: LayoutGrid, end: true },
  { to: '/kana', label: 'Kana', icon: Type },
  { to: '/kanji', label: 'Kanji', icon: KanbanSquare },
  { to: '/bunpou-kotoba', label: 'Bunpou', icon: BookOpen },
  { to: '/flashcard', label: 'Kartu', icon: FlipVertical },
  { to: '/simulasi-jlpt', label: 'JLPT', icon: Timer }
]

export default function AppShell() {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/login')

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-display text-lg font-bold text-slate-800">NihongoBelajar</span>
          </NavLink>
          <div className="text-[10px] tracking-[0.2em] text-slate-400 hidden sm:block font-semibold">
            JLPT N5 - N4
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto pb-28 pt-4">{<Outlet />}</main>

      {!hideNav && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-t border-slate-200">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-6">
              {nav.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 py-2 rounded-lg transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
                      <span
                        className={`text-[10px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}
                      >
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}