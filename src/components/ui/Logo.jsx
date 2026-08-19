// Logo NihongoBelajar — monogram 学 dalam kotak biru modern
export default function Logo({ size = 32, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center justify-center bg-blue-600 text-white font-display font-bold rounded-xl shadow-sm"
        style={{ width: size, height: size, fontSize: size * 0.55 }}
        aria-label="Logo NihongoBelajar"
      >
        学
      </div>
    </div>
  )
}