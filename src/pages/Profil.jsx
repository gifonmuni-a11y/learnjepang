import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { LogOut, UserRound } from 'lucide-react'

export default function Profil() {
  const { user, signOut } = useAuth()

  return (
    <div className="space-y-5 animate-fade-up">
      <header>
        <p className="font-mono text-[10px] tracking-[0.3em] text-washi-faint mb-1.5">アカウント</p>
        <h1 className="font-display font-extrabold text-xl text-washi">Profil</h1>
      </header>

      <div className="glass rounded-2xl p-5 flex items-center gap-4">
        <div className="hanko text-ao-400 p-3" style={{ borderColor: 'rgba(139,124,246,0.5)' }}>
          <UserRound size={22} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-washi truncate">{user?.email ?? 'Belum masuk'}</p>
          <p className="font-mono text-[10px] text-washi-faint mt-0.5">
            {user ? 'Tersambung ke Supabase' : 'Progress belum tersimpan'}
          </p>
        </div>
      </div>

      {user ? (
        <Button variant="danger" className="w-full" onClick={signOut}>
          <LogOut size={15} />
          Keluar
        </Button>
      ) : (
        <EmptyState
          icon={UserRound}
          title="Belum masuk"
          description="Masuk dulu untuk menyimpan progress belajar, deck hafalan, dan skor kuis ke akun kamu."
          actionLabel="Masuk sekarang"
          onAction={() => (window.location.href = '/login')}
        />
      )}
    </div>
  )
}