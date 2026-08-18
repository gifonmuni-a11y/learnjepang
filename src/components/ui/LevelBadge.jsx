// Badge level gaya hanko: N5 (wasabi) / N4 (kin)
const tones = {
  N5: { border: '#2bb88e', text: '#6fe3bd', bg: 'rgba(43,184,142,0.12)' },
  N4: { border: '#d4a95c', text: '#f2d79a', bg: 'rgba(212,169,92,0.12)' }
}

export default function LevelBadge({ level, className = '' }) {
  const t = tones[level] ?? tones.N5
  if (!level) return null
  return (
    <span
      className={`hanko font-mono text-[10px] tracking-widest px-1.5 py-0.5 ${className}`}
      style={{ color: t.text, borderColor: t.border, background: t.bg }}
    >
      {level}
    </span>
  )
}