import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'

export default function Login() {
  const { signInWithMagicLink } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await signInWithMagicLink(email.trim())
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="hw-page min-h-dvh flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex flex-col items-center mb-8">
          <Logo size={52} showWordmark={false} />
          <h1 className="font-display font-extrabold text-2xl tracking-wide mt-4 text-washi">HW LEARN</h1>
          <p className="font-mono text-[10px] tracking-[0.35em] text-washi-faint mt-1.5">NIHONGO N5-N4</p>
        </div>

        <div className="glass rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-4 animate-fade-up">
              <div className="hanko text-wasabi-400 mx-auto mb-4 p-3" style={{ borderColor: 'rgba(63,214,167,0.5)' }}>
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <h2 className="font-display font-bold text-washi mb-2">Cek email kamu</h2>
              <p className="text-sm text-washi-dim leading-relaxed">
                Link masuk sudah dikirim ke <span className="text-washi font-medium">{email}</span>. Buka link itu
                untuk lanjut belajar.
              </p>
              <Button variant="ghost" className="mt-5" onClick={() => setSent(false)}>
                Kirim ulang ke email lain
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="font-display font-bold text-washi">Masuk / Daftar</h2>
                <p className="text-xs text-washi-dim mt-1">
                  Progress, flashcard, dan hafalan kamu tersimpan otomatis.
                </p>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-washi-dim mb-1.5 block">Alamat email</span>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-washi-faint" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="input-hw pl-9"
                    autoComplete="email"
                  />
                </div>
              </label>
              {error && (
                <p className="text-xs text-aka-300 bg-aka-700/20 border border-aka-500/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <Button type="submit" loading={loading} className="w-full">
                Kirim link masuk
                <ArrowRight size={15} />
              </Button>
              <p className="text-[11px] text-washi-faint flex items-start gap-1.5 leading-relaxed">
                <Sparkles size={12} className="mt-0.5 shrink-0 text-kin-400" />
                Tanpa password. Kamu akan menerima link magic untuk masuk. Data kamu aman dan hanya milik kamu.
              </p>
            </form>
          )}
        </div>

        <button
          className="w-full text-center text-xs text-washi-faint mt-6 hover:text-washi-dim transition-colors"
          onClick={() => navigate('/')}
        >
          Kembali ke beranda
        </button>
      </div>
    </div>
  )
}