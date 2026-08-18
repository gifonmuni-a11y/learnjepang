// ============================================================
// TTS — TikTok TTS (voice jp_001) + fallback Web Speech API
// Caching audio di IndexedDB (idb-keyval) agar tidak request
// berulang untuk teks yang sama.
// ============================================================
import { get, set } from 'idb-keyval'

const TIKTOK_URL = 'https://tiktok-tts.weilnet.workers.dev/api/generation'
const VOICE = 'jp_001'
const CACHE_PREFIX = 'tts:'

const audioCache = {
  get: (key) => get(CACHE_PREFIX + key),
  set: (key, value) => set(CACHE_PREFIX + key, value)
}

function cacheKey(text) {
  return `${VOICE}:${text.trim()}`
}

export class TtsError extends Error {
  constructor(message, { usedFallback = false } = {}) {
    super(message)
    this.name = 'TtsError'
    this.usedFallback = usedFallback
  }
}

let lastPlay = null

function playFromBlob(base64Audio) {
  return new Promise((resolve, reject) => {
    try {
      const binary = atob(base64Audio)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => {
        URL.revokeObjectURL(url)
        resolve()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new TtsError('Gagal memutar audio TTS'))
      }
      audio.play().catch(() => {
        URL.revokeObjectURL(url)
        reject(new TtsError('Browser memblokir pemutaran audio'))
      })
    } catch (e) {
      reject(new TtsError('Gagal decode audio: ' + e.message))
    }
  })
}

async function fetchTikTok(text) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(TIKTOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: VOICE }),
      signal: controller.signal
    })
    if (!res.ok) throw new TtsError(`TikTok TTS error ${res.status}`)
    const data = await res.json()
    if (!data.data) throw new TtsError('Respons TikTok TTS kosong')
    return data.data // base64
  } finally {
    clearTimeout(timer)
  }
}

function speakViaWebSpeech(text) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new TtsError('TTS tidak didukung browser ini'))
      return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ja-JP'
    const voices = window.speechSynthesis.getVoices()
    const jpVoice = voices.find((v) => v.lang === 'ja-JP')
    if (jpVoice) utter.voice = jpVoice
    utter.rate = 0.9
    utter.onend = () => resolve()
    utter.onerror = (e) => reject(new TtsError('Web Speech gagal: ' + (e.error || 'unknown')))
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  })
}

/**
 * Bicara teks Jepang. Prioritas: cache → TikTok TTS → Web Speech.
 * @returns {Promise<{source: 'cache'|'tiktok'|'webspeech'}>}
 */
export async function speakJapanese(text) {
  const key = cacheKey(text)
  const cached = await audioCache.get(key)
  if (cached) {
    await playFromBlob(cached)
    return { source: 'cache' }
  }

  try {
    const base64 = await fetchTikTok(text)
    await audioCache.set(key, base64)
    await playFromBlob(base64)
    return { source: 'tiktok' }
  } catch (_e) {
    try {
      await speakViaWebSpeech(text)
      return { source: 'webspeech' }
    } catch (fallbackErr) {
      throw new TtsError(`TTS tidak tersedia: ${fallbackErr.message}`, { usedFallback: true })
    }
  }
}

/** Cooldown antar pemutaran agar tidak tumpang tindih */
export async function playTts(text) {
  const now = Date.now()
  if (lastPlay && now - lastPlay < 400) {
    await new Promise((r) => setTimeout(r, 400 - (now - lastPlay)))
  }
  lastPlay = Date.now()
  return speakJapanese(text)
}

export function warmVoices() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
  }
}
