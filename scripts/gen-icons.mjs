// Generate ikon PWA (PNG) tanpa canvas — encoder PNG murni Node (zlib).
// Ikon: segi empat sumi ink + stempel hanko aka dengan monogram "HW".
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const BG = [11, 14, 23] // sumi-900
const SEAL = [224, 72, 74] // aka-500
const INK = [232, 230, 223] // washi

const crcTable = []
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c >>> 0
}
function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function png(size, px) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = px(x, y)
      const off = y * (size * 4 + 1) + 1 + x * 4
      raw[off] = r
      raw[off + 1] = g
      raw[off + 2] = b
      raw[off + 3] = a
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ])
}

function makeIcon(size) {
  const corner = Math.round(size * 0.19)
  const sealPad = Math.round(size * 0.16)
  const sealCorner = Math.round(size * 0.08)
  const stroke = Math.max(2, Math.round(size * 0.045))
  const inSeal = (x, y) => {
    const sx = x - sealPad
    const sy = y - sealPad
    const edge = size - sealPad * 2
    if (sx < 0 || sy < 0 || sx >= edge || sy >= edge) return false
    const r = Math.min(sx, sy, edge - sx, edge - sy)
    return r > sealCorner
  }
  const inStroke = (x, y) => {
    const sx = x - sealPad
    const sy = y - sealPad
    const edge = size - sealPad * 2
    if (sx < 0 || sy < 0 || sx >= edge || sy >= edge) return false
    const r = Math.min(sx, sy, edge - sx, edge - sy)
    return r <= sealCorner + stroke && r >= sealCorner - stroke
  }
  // Monogram HW: dua balok vertikal + palang horizontal
  const inH = (x, y) => {
    const cx = x / size
    const cy = y / size
    const mid = 0.5
    const w1 = 0.085, w2 = 0.075
    const left = (Math.abs(cx - 0.37) < w1) && (cy > 0.28 && cy < 0.72)
    const right = (Math.abs(cx - 0.63) < w1) && (cy > 0.28 && cy < 0.72)
    const bar = (Math.abs(cy - 0.5) < w2) && (cx > 0.37 - w1 * 0.6 && cx < 0.63 + w1 * 0.6)
    return left || right || bar
  }
  return (x, y) => {
    if (inSeal(x, y)) return [...BG, 255]
    if (inStroke(x, y)) return [...SEAL, 255]
    if (inH(x, y)) return [...INK, 255]
    return [...BG, 255]
  }
}

for (const size of [192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), png(size, makeIcon(size)))
  console.log(`icon-${size}.png selesai`)
}