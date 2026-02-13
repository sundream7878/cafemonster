/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F4F6FB",
        foreground: "#0F172A",
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          light: "#EEF2FF",
        },
        sidebar: "#FFFFFF",
        card: "#FFFFFF",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 50px -12px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}
