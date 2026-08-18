// Shell halaman modul — akan diisi konten di fase berikutnya
import { Link } from 'react-router-dom'
import { Layers, PenLine, FileQuestion, ChevronRight } from 'lucide-react'
import LevelBadge from '../ui/LevelBadge'

const modes = [
  {
    key: 'materi',
    label: 'Mode Materi',
    desc: 'Referensi lengkap, cari & filter',
    icon: Layers,
    accent: 'text-ao-400 border-ao-500/40'
  },
  {
    key: 'card',
    label: 'Mode Flashcard',
    desc: 'Hafal dengan sistem SRS',
    icon: PenLine,
    accent: 'text-wasabi-400 border-wasabi-500/40'
  },
  {
    key: 'kuis',
    label: 'Mode Kuis',
    desc: 'Soal gaya JLPT/JFT',
    icon: FileQuestion,
    accent: 'text-aka-400 border-aka-500/40'
  }
]

export default function ModuleLanding({ basePath, name, jp, desc, levels = ['N5', 'N4'], modules = modes }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <header>
        <p className="font-mono text-[10px] tracking-[0.3em] text-washi-faint mb-1.5">{jp}</p>
        <h1 className="font-display font-extrabold text-xl text-washi">{name}</h1>
        <p className="text-sm text-washi-dim mt-1">{desc}</p>
        <div className="flex gap-2 mt-3">
          {levels.map((l) => (
            <LevelBadge key={l} level={l} />
          ))}
        </div>
      </header>

      <div className="grid gap-3">
        {modules.map((m) => (
          <Link
            key={m.key}
            to={m.key === 'materi' ? basePath : `${basePath}/${m.key}`}
            className="glass rounded-2xl p-4 flex items-center gap-4 transition-transform active:scale-[0.98] hover:border-washi/20"
          >
            <div className={`h-11 w-11 shrink-0 rounded-xl border bg-sumi-900 flex items-center justify-center ${m.accent}`}>
              <m.icon size={20} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-washi text-sm">{m.label}</h3>
              <p className="text-xs text-washi-dim mt-0.5">{m.desc}</p>
            </div>
            <ChevronRight size={16} className="text-washi-faint shrink-0" />
          </Link>
        ))}
      </div>

      <div className="genkoyoshi-panel glass rounded-2xl p-4 text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] text-washi-faint">KONTEN SEDANG DISIAPKAN</p>
        <p className="text-xs text-washi-dim mt-2">
          Modul ini sedang dalam pengembangan dan akan terisi di fase berikutnya.
        </p>
      </div>
    </div>
  )
}