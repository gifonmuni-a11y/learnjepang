/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Key lama dipetakan ke palette light slate/blue-gray agar semua
        // komponen existing ikut tema baru tanpa perlu diubah.
        sumi: {
          950: '#f8fafc',
          900: '#f8fafc',
          800: '#f1f5f9',
          700: '#e2e8f0',
          600: '#cbd5e1'
        },
        washi: {
          DEFAULT: '#0f172a',
          dim: '#475569',
          faint: '#94a3b8'
        },
        aka: {
          300: '#fca5a5',
          400: '#ef4444',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b'
        },
        wasabi: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981'
        },
        ao: {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6'
        },
        kin: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b'
        }
      },
      fontFamily: {
        display: ['"Yu Mincho"', '"Hiragino Mincho ProN"', '"Noto Serif JP"', '"MS Mincho"', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        lift: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.06)',
        glow: '0 0 0 1px rgba(59, 130, 246, 0.15), 0 8px 24px -8px rgba(59, 130, 246, 0.4)',
        'glow-teal': '0 0 0 1px rgba(16, 185, 129, 0.15), 0 8px 24px -8px rgba(16, 185, 129, 0.4)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.3s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'slide-left': 'slide-left 0.25s ease-out both',
        'slide-right': 'slide-right 0.25s ease-out both'
      }
    }
  },
  plugins: []
}