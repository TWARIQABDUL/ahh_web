/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A2B45",
        teal: "#00BFFF",
        white: "#FFFFFF",
        lightGray: "#A0A0A0",
        darkGray: "#333333",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 1s ease-out forwards",
        scroll: "scroll 20s linear infinite",
        kenburns: "kenburns 15s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
