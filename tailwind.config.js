/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#090C10',
        surface: '#12161F',
        border: 'rgba(255,255,255,0.05)',
        primary: '#4F46E5', // sophisticated indigo
        risk: {
          low: '#059669', // slightly muted emerald
          medium: '#D97706', // richer amber
          high: '#DC2626' // richer red
        },
        parchment: '#F8FAFC',
        text: {
          main: '#F3F4F6',
          muted: '#8B949E'
        }
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
