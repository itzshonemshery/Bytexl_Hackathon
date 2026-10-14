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
          surface: '#F8F9FA',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'clinical': '0 4px 16px -2px rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px -3px rgba(215, 25, 32, 0.08), 0 4px 6px -2px rgba(0,0,0,0.03)',
      }
    },
  },
  plugins: [],
}
