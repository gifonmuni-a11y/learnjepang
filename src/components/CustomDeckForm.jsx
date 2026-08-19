// ============================================================
// CustomDeckForm — form tambah kartu custom.
// Depan: char, furigana_atas, arti_id, arti_en, kunyomi, onyomi.
// Belakang: tepat 8 grup input (kanji, furigana, arti).
// Menghasilkan kartu sesuai cardSchema.js lalu menambahkannya
// ke deck via onSave(card).
// ============================================================
import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { validateCard } from '../lib/cardSchema'

const EMPTY_VOCAB = { kanji: '', furigana: '', arti: '' }

export default function CustomDeckForm({ onSave, onClose }) {
  const [front, setFront] = useState({
    char: '',
    furigana_atas: '',
    arti_id: '',
    arti_en: '',
    kunyomi: '',
    onyomi: ''
  })
  const [vocab, setVocab] = useState(Array.from({ length: 8 }, () => ({ ...EMPTY_VOCAB })))
  const [error, setError] = useState('')

  const setF = (key) => (e) => setFront((f) => ({ ...f, [key]: e.target.value }))
  const setV = (i) => (key) => (e) =>
    setVocab((arr) => arr.map((v, idx) => (idx === i ? { ...v, [key]: e.target.value } : v)))

  const handleSave = () => {
    const card = {
      id: 'custom-' + Date.now(),
      ...front,
      kosakata: vocab.filter((v) => v.kanji || v.furigana || v.arti)
    }
    const err = validateCard(card)
    if (err) {
      setError(err)
      return
    }
    setError('')
    onSave(card)
    setFront({ char: '', furigana_atas: '', arti_id: '', arti_en: '', kunyomi: '', onyomi: '' })
    setVocab(Array.from({ length: 8 }, () => ({ ...EMPTY_VOCAB })))
  }

  return (
    <div className="card-base p-5 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-wide">TAMBAH KARTU CUSTOM</h3>
        <button
          onClick={onClose}
          aria-label="Tutup form"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>

      {/* Sisi depan */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Huruf / Kanji Utama</label>
          <input className="input-base" value={front.char} onChange={setF('char')} placeholder="学" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Furigana Atas</label>
          <input className="input-base" value={front.furigana_atas} onChange={setF('furigana_atas')} placeholder="がく" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Arti (Indonesia)</label>
          <input className="input-base" value={front.arti_id} onChange={setF('arti_id')} placeholder="belajar" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Arti (Inggris)</label>
          <input className="input-base" value={front.arti_en} onChange={setF('arti_en')} placeholder="study" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Kun-yomi</label>
          <input className="input-base" value={front.kunyomi} onChange={setF('kunyomi')} placeholder="まな.ぶ" />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">On-yomi</label>
          <input className="input-base" value={front.onyomi} onChange={setF('onyomi')} placeholder="ガク" />
        </div>
      </div>

      {/* Kosakata sisi belakang — tepat 8 slot */}
      <h4 className="mt-5 mb-2 text-xs font-bold text-slate-700 border-b border-slate-200 pb-2">
        KOSAKATA SISI BELAKANG (maks. 8)
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {vocab.map((v, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <p className="text-[10px] font-bold text-slate-400 mb-1.5">KATA {i + 1}</p>
            <input
              className="input-base mb-1.5 !py-1.5 text-sm"
              value={v.kanji}
              onChange={setV(i)('kanji')}
              placeholder="Kanji"
            />
            <input
              className="input-base mb-1.5 !py-1.5 text-sm"
              value={v.furigana}
              onChange={setV(i)('furigana')}
              placeholder="Furigana"
            />
            <input
              className="input-base !py-1.5 text-sm"
              value={v.arti}
              onChange={setV(i)('arti')}
              placeholder="Arti"
            />
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <button onClick={handleSave} className="btn-primary w-full mt-4">
        <Save size={16} />
        Simpan Kartu Custom
      </button>
    </div>
  )
}