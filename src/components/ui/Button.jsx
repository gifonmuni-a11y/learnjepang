import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-aka-500 hover:bg-aka-400 text-washi shadow-glow disabled:bg-sumi-600 disabled:shadow-none',
  ghost: 'bg-transparent border border-washi/15 text-washi hover:border-washi/30',
  subtle: 'bg-sumi-700 text-washi hover:bg-sumi-600 border border-transparent',
  danger: 'bg-aka-700/40 border border-aka-500/40 text-aka-300 hover:bg-aka-700/60'
}

export default function Button({ variant = 'primary', loading = false, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  )
}