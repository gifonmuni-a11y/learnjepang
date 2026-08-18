import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profil from './pages/Profil'
import HiraganaKatakana from './pages/HiraganaKatakana'
import BunpouKotoba from './pages/BunpouKotoba'
import Kanji from './pages/Kanji'
import Hafalan from './pages/Hafalan'
import SimulasiJlpt from './pages/SimulasiJlpt'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="/hiragana-katakana" element={<HiraganaKatakana />} />
          <Route path="/hiragana-katakana/card" element={<ComingSoon title="Flashcard Kana" />} />
          <Route path="/hiragana-katakana/kuis" element={<ComingSoon title="Kuis Kana" />} />

          <Route path="/bunpou-kotoba" element={<BunpouKotoba />} />
          <Route path="/bunpou-kotoba/card" element={<ComingSoon title="Flashcard Bunpou & Kotoba" />} />
          <Route path="/bunpou-kotoba/kuis" element={<ComingSoon title="Kuis Bunpou & Kotoba" />} />

          <Route path="/kanji" element={<Kanji />} />
          <Route path="/kanji/card" element={<ComingSoon title="Flashcard Kanji" />} />
          <Route path="/kanji/kuis" element={<ComingSoon title="Kuis Kanji" />} />

          <Route path="/hafalan" element={<Hafalan />} />
          <Route path="/hafalan/buat" element={<HafalanBuat />} />
          <Route path="/hafalan/card/:deckId" element={<HafalanReview />} />

          <Route path="/simulasi-jlpt" element={<SimulasiJlpt />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}