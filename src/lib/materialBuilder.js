// ============================================================
// Mapper: bunpou.json + particles.json + materi-meta*.json
// -> kartu materi (skema materialSchema.js)
// ============================================================
import bunpouData from '../data/bunpou.json'
import particlesData from '../data/particles.json'
import metaN5 from '../data/materi-meta-n5.json'
import metaN4 from '../data/materi-meta-n4.json'
import metaPartikel from '../data/materi-meta-partikel.json'
import { DEFAULT_CATEGORY, normalizeExample } from './materialSchema'

const META = {
  ...metaN5,
  ...metaN4,
  ...metaPartikel
}

function buildCard({ id, level, pattern, explanation, examples, meta }) {
  const m = meta || {}
  return {
    id,
    level: level || 'N5',
    category: m.category || DEFAULT_CATEGORY,
    title: m.title || pattern,
    prompt: m.prompt || `Apa fungsi / bentuk "${pattern}"?`,
    pattern,
    explanation: explanation || '',
    examples: (Array.isArray(examples) ? examples : []).map(normalizeExample)
  }
}

function buildBunpouDeck(level = 'ALL') {
  const list =
    level === 'ALL' ? bunpouData : bunpouData.filter((b) => b.level === level)
  return list.map((b) =>
    buildCard({
      id: b.id,
      level: b.level,
      pattern: b.pattern,
      explanation: b.explanation,
      examples: b.examples,
      meta: META[b.id]
    })
  )
}

function buildPartikelDeck() {
  return particlesData.map((p) =>
    buildCard({
      id: p.id,
      level: 'N5',
      pattern: `${p.char} — ${p.romaji || ''}`.trim(),
      explanation: p.function,
      examples: p.examples,
      meta: META[p.id]
    })
  )
}

export const MATERIAL_LIBRARIES = [
  { id: 'bunpou-n5', label: 'Bunpou N5', desc: '60 pola tata bahasa dasar', build: () => buildBunpouDeck('N5') },
  { id: 'bunpou-n4', label: 'Bunpou N4', desc: '60 pola tata bahasa lanjutan', build: () => buildBunpouDeck('N4') },
  { id: 'partikel', label: 'Partikel', desc: '22 partikel + fungsinya', build: () => buildPartikelDeck() }
]