// ============================================================
// patch-rollup-wasm.mjs
// Ganti binding native Rollup (NAPI .node) dengan @rollup/wasm-node.
// Latar: lingkungan Android/PRoot — semua modul NAPI (.node)
// crash SIGBUS saat di-dlopen. WASM build bekerja normal.
// ============================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const require = createRequire(import.meta.url)

function findRollupDir() {
  const candidates = [
    resolve('node_modules/rollup'),
    resolve('node_modules/.pnpm/rollup@4.62.4/node_modules/rollup')
  ]
  for (const dir of candidates) {
    if (existsSync(resolve(dir, 'dist/native.js'))) return dir
  }
  throw new Error('rollup/dist/native.js tidak ditemukan')
}

const rollupDir = findRollupDir()
const nativePath = resolve(rollupDir, 'dist/native.js')
const source = readFileSync(nativePath, 'utf8')

if (source.includes('@rollup/wasm-node')) {
  console.log('[patch-rollup] sudah ter-patch, lanjut.')
  process.exit(0)
}

// Pastikan @rollup/wasm-node benar-benar bisa di-resolve
try {
  require.resolve('@rollup/wasm-node')
} catch {
  console.error('[patch-rollup] @rollup/wasm-node belum terinstall. Jalankan: pnpm add -D @rollup/wasm-node')
  process.exit(1)
}

const patched = source.replace(
  /const \{ parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 \} = requireWithFriendlyError\([\s\S]*?\);/,
  "const { parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = require('@rollup/wasm-node');"
)

if (patched === source) {
  console.error('[patch-rollup] GAGAL: pola require tidak ditemukan di native.js')
  process.exit(1)
}

writeFileSync(nativePath, patched)
console.log('[patch-rollup] native.js Rollup diarahkan ke @rollup/wasm-node:', nativePath)