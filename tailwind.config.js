/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sumi: {
          950: '#07090f',
          900: '#0b0e17',
          800: '#111527',
          700: '#1a2036',
          600: '#232b47'
        },
        washi: {
          DEFAULT: '#e8e6df',
          dim: '#a7a8b8',
          faint: '#6e7388'
        },
        aka: {
          300: '#ff8a8c',
          400: '#f05557',
          500: '#e0484a',
          600: '#c23b3d',
          700: '#9c2f31'
        },
        wasabi: {
          300: '#6fe3bd',
          400: '#3fd6a7',
          500: '#2bb88e'
        },
        ao: {
          300: '#a99bf9',
          400: '#8b7cf6',
          500: '#6f5ee8'
        },
        kin: {
          300: '#f2d79a',
          400: '#e8c37a',
          500: '#d4a95c'
        }
      },
      fontFamily: {
        display: ['"M PLUS Rounded 1c"', '"Zen Kaku Gothic New"', 'system-ui', 'sans-serif'],
        body: ['"Zen Kaku Gothic New"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        glow: '0 0 24px rgba(224, 72, 74, 0.28)',
        'glow-teal': '0 0 24px rgba(63, 214, 167, 0.22)',
        card: '0 8px 32px rgba(0, 0, 0, 0.35)'
      },
      backgroundImage: {
        'genkoyoshi': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath d=\'M32 0H0V32\' fill=\'none\' stroke=\'%231a2036\' stroke-opacity=\'0.5\' stroke-width=\'1\'/%3E%3C/svg%3E")'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'flip-in': {
          '0%': { opacity: '0', transform: 'rotateY(90deg)' },
          '100%': { opacity: '1', transform: 'rotateY(0deg)' }
        },
        'stamp-in': {
          '0%': { opacity: '0', transform: 'scale(1.6)' },
          '60%': { opacity: '1', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'flip-in': 'flip-in 0.45s ease-out both',
        'stamp-in': 'stamp-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: []
}
