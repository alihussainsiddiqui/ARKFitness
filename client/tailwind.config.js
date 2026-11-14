/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#171717',
        darkCard: '#262626',
        primary: '#F97316',
        accent: '#FDBA74',
        headings: '#FAFAFA',
        bodyText: '#A3A3A3'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Default body text
        heading: ['Montserrat', 'sans-serif'], // For h1, h2, h3
      }
    },
  },
  plugins: [],
}