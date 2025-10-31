// tailwind.config.js (CÓDIGO CORRECTO)
/** @type {import('tailwindcss').Config} */
export default { // <-- DEBE USAR 'export default'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}