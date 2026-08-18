// Canvas nulis genkoyoshi (grid sumi) dengan tombol hapus & bantuan track.
import { useState, useRef, useEffect } from 'react'

const GRID_SIZE = 32
const GRID_LINE = 1.6
const BASE_OPACITY = 0.14
const STROKE = 3.2
const CANVAS_W = GRID_SIZE * 20
const CANVAS_H = GRID_SIZE * 20

export default function CanvasWrite({ char, traceOpacity = 0.12, onChange, onDone }) {
  const canvasRef = useRef(null)
  const [points, setPoints] = useState([])
  const [mode, setMode] = useState('draw') // draw or erase
  const [finished, setFinished] = useState(false)

  const scale = Math.min(
    (window.innerWidth - 32) / CANVAS_W,
    (window.innerHeight - 64) / CANVAS_H
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CANVAS_W
    canvas.height = CANVAS_H
    canvas.style.width = `${CANVAS_W * scale}px`
    canvas.style.height = `${CANVAS_H * scale}px`
    canvas.getContext('2d').reset()
  }, [scale])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.reset()
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.globalAlpha = BASE_OPACITY
    ctx.strokeStyle = '#111'
    ctx.lineWidth = GRID_LINE

    // draw genkoyoshi
    ctx.beginPath()
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.moveTo(i * 20, 0)
      ctx.lineTo(i * 20, CANVAS_H)
      ctx.moveTo(0, i * 20)
      ctx.lineTo(CANVAS_W, i * 20)
    }
    ctx.stroke()

    // trace char background jika ada
    if (char) {
      ctx.globalAlpha = traceOpacity
      ctx.fillStyle = '#111'
      // placeholder: ukuran char umum
      const charRatio = 0.58
      const cw = CANVAS_W * charRatio
      const ch = CANVAS_H * charRatio
      const cx = (CANVAS_W - cw) / 2
      const cy = (CANVAS_H - ch) / 2
      ctx.fillRect(cx, cy, cw, ch)
    }

    ctx.globalAlpha = 1
    ctx.strokeStyle = '#6b4'
    ctx.lineWidth = STROKE

    let isDrawing = false
    let lastX = 0
    let lastY = 0

    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / scale
      const y = (e.clientY - rect.top) / scale
      return { x, y }
    }

    function handlePointerDown(e) {
      e.preventDefault()
      e.stopPropagation()
      isDrawing = true
      const pos = getPointerPos(e)
      lastX = pos.x
      lastY = pos.y
    }

    function handlePointerMove(e) {
      if (!isDrawing) return
      e.preventDefault()
      const pos = getPointerPos(e)
      const dx = pos.x - lastX
      const dy = pos.y - lastY
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return

      const ctx = canvas.getContext('2d')
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = STROKE
      ctx.strokeStyle = '#1a1a1a'
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()

      setPoints((prev) => [...prev, { x: pos.x, y: pos.y, mode }])
      lastX = pos.x
      lastY = pos.y
    }

    function handlePointerUp() {
      isDrawing = false
    }

    function handleTouchStart(e) {
      e.preventDefault()
      handlePointerDown(e.touches[0])
    }

    function handleTouchMove(e) {
      e.preventDefault()
      handlePointerMove(e.touches[0])
    }

    function handleTouchEnd() {
      handlePointerUp()
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointerleave', handlePointerUp)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointerleave', handlePointerUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [char])

  const clear = () => {
    setPoints([])
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.reset()
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.globalAlpha = BASE_OPACITY
      ctx.strokeStyle = '#111'
      ctx.lineWidth = GRID_LINE
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath()
        ctx.moveTo(i * 20, 0)
        ctx.lineTo(i * 20, CANVAS_H)
        ctx.moveTo(0, i * 20)
        ctx.lineTo(CANVAS_W, i * 20)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
  }

  const finish = () => {
    setFinished(true)
    if (onDone) onDone()
  }

  return (
    <div className="space-y-3">
      {finished ? (
        <div className="genkoyoshi-panel glass rounded-xl p-4 text-center">
          <p className="font-mono text-sm text-washi fint">✓ Seni kamu tercatat</p>
          <p className="text-xs text-washi-dim mt-1">Masukkan ulang untuk melanjutkan</p>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="genkoyoshi-panel glass rounded-xl border border-washi/20"
            width={CANVAS_W}
            height={CANVAS_H}
          />
          <div className="flex gap-2">
            <button
              onClick={clear}
              className="flex-1 rounded-xl border border-washi/30 bg-sumi-800 text-washi text-xs py-1.5"
            >
              Bersihkan
            </button>
            <button
              onClick={finish}
              disabled={points.length < 10}
              className="flex-1 rounded-xl border bg-aka-500 text-white text-xs py-1.5 hover:bg-aka-400"
            >
              {points.length >= 10 ? 'Selesai' : 'Lanjutkan'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}