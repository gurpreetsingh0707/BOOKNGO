/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryHover: "#1D4ED8",
        secondary: "#4F46E5",
        bg: "#F9FAFB",
        card: "#FFFFFF",
        border: "#E5E7EB",
        textDark: "#111827",
        textLight: "#6B7280",
      },

      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1)",
        cardHover: "0 4px 10px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
}