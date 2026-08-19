import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profil from './pages/Profil'
import HiraganaKatakana from './pages/HiraganaKatakana'
import BunpouKotoba from './pages/BunpouKotoba'
import Kanji from './pages/Kanji'
import SimulasiJlpt from './pages/SimulasiJlpt'
import FlashcardPage from './pages/FlashcardPage'
import QuizPage from './components/QuizPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="/kana" element={<HiraganaKatakana />} />
          <Route path="/kanji" element={<Kanji />} />
          <Route path="/bunpou-kotoba" element={<BunpouKotoba />} />

          <Route path="/flashcard" element={<FlashcardPage />} />
          <Route path="/kuis" element={<QuizPage />} />

          <Route path="/simulasi-jlpt" element={<SimulasiJlpt />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}