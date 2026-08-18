// Logo HW Learn — monogram "HW" dalam stempel hanko (seal vermillion)
export default function Logo({ size = 36, showWordmark = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="hanko text-aka-400 bg-sumi-900"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.42,
          borderWidth: Math.max(2, Math.round(size * 0.06)),
          borderRadius: size * 0.12
        }}
        aria-label="Logo HW"
      >
        HW
      </div>
      {showWordmark && (
        <div className="leading-none">
          <div className="font-display font-extrabold tracking-wide text-washi text-sm">HW LEARN</div>
          <div className="font-mono text-[9px] tracking-[0.3em] text-washi-faint mt-1">NIHONGO N5-N4</div>
        </div>
      )}
    </div>
  )
}