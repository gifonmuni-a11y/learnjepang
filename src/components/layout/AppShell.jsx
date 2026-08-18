import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutGrid, Type, BookOpen, KanbanSquare, ScrollText, UserRound } from 'lucide-react'
import Logo from '../ui/Logo'

const nav = [
  { to: '/', label: 'Beranda', icon: LayoutGrid, end: true },
  { to: '/hiragana-katakana', label: 'Kana', icon: Type },
  { to: '/bunpou-kotoba', label: 'Bunpou', icon: BookOpen },
  { to: '/kanji', label: 'Kanji', icon: KanbanSquare },
  { to: '/hafalan', label: 'Hafalan', icon: ScrollText },
  { to: '/profil', label: 'Profil', icon: UserRound }
]

export default function AppShell() {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/login')

  return (
    <div className="hw-page min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 safe-top">
        <div className="glass border-x-0 border-t-0 px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center">
            <Logo size={34} />
          </NavLink>
          <div className="font-mono text-[10px] tracking-[0.25em] text-washi-faint hidden sm:block">JLPT N5-N4</div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pb-28 pt-4">{<Outlet />}</main>

      {!hideNav && (
        <nav className="fixed bottom-0 inset-x-0 z-40 safe-bottom">
          <div className="glass-strong border-x-0 border-b-0 max-w-3xl mx-auto">
            <div className="grid grid-cols-6 px-1 pt-1.5 pb-1.5">
              {nav.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-colors ${
                      isActive ? 'text-aka-400' : 'text-washi-faint hover:text-washi-dim'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
                      <span className={`font-mono text-[9px] tracking-wider ${isActive ? 'font-bold' : ''}`}>
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