import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profil from './pages/Profil'
import HiraganaKatakana from './pages/HiraganaKatakana'
import BunpouKotoba from './pages/BunpouKotoba'
import Kanji from './pages/Kanji'
import Hafalan from './pages/Hafalan'
import HafalanBuat from './pages/HafalanBuat'
import HafalanReview from './pages/HafalanReview'
import SimulasiJlpt from './pages/SimulasiJlpt'
import FlashcardPage from './components/FlashcardPage'
import QuizPage from './components/QuizPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="/hiragana-katakana" element={<HiraganaKatakana />} />
          <Route path="/hiragana-katakana/card" element={<FlashcardPage />} />
          <Route path="/hiragana-katakana/kuis" element={<QuizPage />}/>

          <Route path="/bunpou-kotoba" element={<BunpouKotoba />} />
          <Route path="/bunpou-kotoba/card" element={<FlashcardPage />} />
          <Route path="/bunpou-kotoba/kuis" element={<QuizPage />}/>

          <Route path="/kanji" element={<Kanji />} />
          <Route path="/kanji/card" element={<FlashcardPage />} />
          <Route path="/kanji/kuis" element={<QuizPage />}/>

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