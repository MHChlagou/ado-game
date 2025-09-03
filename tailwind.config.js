/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azure-blue': '#0078d4',
        'azure-dark': '#106ebe',
        'azure-light': '#40e0d0',
        'success': '#107c10',
        'warning': '#ff8c00',
        'error': '#d13438',
      },
      fontFamily: {
        'game': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #0078d4, 0 0 10px #0078d4, 0 0 15px #0078d4' },
          '100%': { boxShadow: '0 0 10px #0078d4, 0 0 20px #0078d4, 0 0 30px #0078d4' },
        }
      }
    },
  },
  plugins: [],
}
