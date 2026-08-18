// State kosong / error — didesain dengan tone yang sama (bukan alert box polos)
import { Inbox, TriangleAlert, RefreshCw } from 'lucide-react'
import Button from './Button'

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      <div className="hanko text-washi-faint p-3 mb-4" style={{ borderColor: 'rgba(232,230,223,0.15)' }}>
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <h3 className="font-display font-bold text-washi text-base mb-1">{title}</h3>
      {description && <p className="text-sm text-washi-dim max-w-xs leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function ErrorState({ title = 'Terjadi kesalahan', description, onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      <div className="hanko text-aka-400 p-3 mb-4" style={{ borderColor: 'rgba(224,72,74,0.5)' }}>
        <TriangleAlert size={26} strokeWidth={1.5} />
      </div>
      <h3 className="font-display font-bold text-washi text-base mb-1">{title}</h3>
      {description && <p className="text-sm text-washi-dim max-w-xs leading-relaxed">{description}</p>}
      {onRetry && (
        <Button variant="ghost" className="mt-5" onClick={onRetry}>
          <RefreshCw size={15} />
          Coba lagi
        </Button>
      )}
    </div>
  )
}