/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",
        "primary-dark": "#4c1d95",
        accent: "#fbbf24",
        surface: "#26263a",
        "bg-main": "#18181b",
        "bg-light": "#232336",
        "text-main": "#f3f4f6",
        "text-muted": "#a1a1aa",
        error: "#ef4444",
        success: "#22c55e"
      },
      borderRadius: {
        'xl': '1.25rem'
      }
    },
  },
  plugins: [],
} 