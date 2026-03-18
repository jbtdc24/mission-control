/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'julz-black': '#1a1a1a',
        'julz-dark': '#2d2d2d',
        'julz-cream': '#f5f5f0',
        'julz-coffee': '#8b6f47',
        'monday-navy': '#1e3a5f',
        'monday-cream': '#faf9f6',
        'monday-amber': '#d4a574',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b981',
        'accent-purple': '#8b5cf6',
        'accent-red': '#ef4444',
        'accent-yellow': '#f59e0b',
        'accent-gray': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}