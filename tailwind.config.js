/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#141414',
        'bg-card': '#1a1a1a',
        'bg-hover': '#252525',
        'text-primary': '#f5f5f0',
        'text-secondary': '#a3a3a3',
        'text-muted': '#737373',
        'accent-navy': '#1e3a5f',
        'accent-navy-hover': '#254670',
        'accent-amber': '#d4a574',
        'accent-coffee': '#8b6f47',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}