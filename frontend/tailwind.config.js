/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          red: '#D71920',
          'red-hover': '#BF151B',
          'red-dark': '#991015',
          'red-light': '#FEE2E2',
          'red-subtle': '#FFF5F5',
          'red-blush': '#FEF2F2',
          black: '#111111',
          charcoal: '#1A1A1A',
          dark: '#242424',
          muted: '#6B7280',
          border: '#E5E7EB',
          surface: '#FAFAFB',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['"Libre Baskerville"', 'Georgia', 'serif'],
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'clinical': '0 4px 20px -2px rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 28px -4px rgba(215, 25, 32, 0.08), 0 4px 10px -2px rgba(0,0,0,0.03)',
      },
      keyframes: {
        'slide-fade': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-next': {
          '0%': { opacity: '0', transform: 'translateX(28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-prev': {
          '0%': { opacity: '0', transform: 'translateX(-28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-fade': 'slide-fade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-next': 'slide-next 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-prev': 'slide-prev 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
