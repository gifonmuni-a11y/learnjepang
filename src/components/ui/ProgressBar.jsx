export default function ProgressBar({ value = 0, tone = 'wasabi', className = '', height = 6 }) {
  const clamped = Math.max(0, Math.min(100, value))
  const tones = {
    wasabi: 'bg-wasabi-400 shadow-glow-teal',
    aka: 'bg-aka-500 shadow-glow',
    ao: 'bg-ao-400',
    kin: 'bg-kin-400'
  }
  return (
    <div
      className={`w-full rounded-full bg-sumi-700 overflow-hidden ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${tones[tone] ?? tones.wasabi}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}