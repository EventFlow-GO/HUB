/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ef-green': '#14552E',
        'ef-red': '#B80D0D',
        'ef-blue': '#002F62',
        'ef-yellow': '#FFCB30',
        'ef-cream': '#F9F5B5',
        'ef-white': '#FAFAFA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        editorial: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
