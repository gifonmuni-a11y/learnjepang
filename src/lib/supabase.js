import { createClient } from '@supabase/supabase-js'

// Defensive init: jangan sampai crash di module-level meski env vars salah/tidak ada.
// VITE_SUPABASE_URL harus URL valid; ANON_KEY harus JWT (2 bagian dipisah titik).
const rawUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim()
const rawKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

function isValidUrl(value) {
  try {
    const u = new URL(value)
    return /^https?:$/.test(u.protocol) && u.hostname.includes('.')
  } catch {
    return false
  }
}

function isValidKey(value) {
  return typeof value === 'string' && value.split('.').length >= 2 && value.length > 40
}

const configured = isValidUrl(rawUrl) && isValidKey(rawKey)

// Mock supabase yang aman: semua method mengembalikan Promise yang resolve
// dengan hasil kosong sehingga panggilan di seluruh aplikasi tidak pernah crash.
const safeResolve = () => Promise.resolve({ data: null, error: null, count: 0, status: 200 })

function createNullProxy() {
  const proxy = new Proxy(function () {
    return safeResolve()
  }, {
    get(_target, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') return undefined
      return createNullProxy()
    },
    apply() {
      return safeResolve()
    }
  })
  return proxy
}

const nullClient = createNullProxy()

export const supabase = configured
  ? createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : nullClient

export const isSupabaseConfigured = () => configured

// Daftar masalah konfigurasi (untuk debugging)
export function initSupabaseError() {
  const errors = []
  if (!rawUrl) errors.push('VITE_SUPABASE_URL kosong')
  else if (!isValidUrl(rawUrl)) errors.push('VITE_SUPABASE_URL bukan URL valid')
  if (!rawKey) errors.push('VITE_SUPABASE_ANON_KEY kosong')
  else if (!isValidKey(rawKey)) errors.push('VITE_SUPABASE_ANON_KEY bukan JWT valid')
  return errors
}