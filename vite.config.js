import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'HW Learn — Belajar Bahasa Jepang',
        short_name: 'HW Learn',
        description: 'Belajar bahasa Jepang N5-N4: hiragana, katakana, kanji, bunpou, flashcard, dan latihan soal.',
        theme_color: '#0b0e17',
        background_color: '#0b0e17',
        display: 'standalone',
        start_url: '/',
        lang: 'id',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallbackDenylist: [/^\/api/]
      }
    })
  ]
})
