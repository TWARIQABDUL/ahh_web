/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A2B45",   // Primary Blue
        teal: "#00BFFF",      // Accent Teal
        white: "#FFFFFF",     // Pure White
        lightGray: "#A0A0A0", // Light Gray
        darkGray: "#333333",  // Dark Gray
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 1s ease-out forwards",
      },
    },
  },
  plugins: [],
}
