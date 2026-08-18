import { EmptyState } from '../components/ui/EmptyState'
import { Construction } from 'lucide-react'

export default function ComingSoon({ title = 'Halaman ini sedang disiapkan', desc }) {
  return (
    <div className="animate-fade-up">
      <EmptyState
        icon={Construction}
        title={title}
        description={desc ?? 'Fitur ini akan tersedia di fase pengembangan berikutnya.'}
      />
    </div>
  )
}