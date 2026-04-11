/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        card: '#1e293b',
        border: 'rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
