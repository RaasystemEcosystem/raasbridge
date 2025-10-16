/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        raasBlack: "#0b0b0c",
        raasDark: "#1c1c1e",
        raasGray: "#2c2c2e",
        raasYellow: "#FFD700",
        raasYellowLight: "#FFE066",
        raasGreen: "#00ff7f"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"]
      },
      boxShadow: {
        raasGlow: "0 0 10px rgba(255, 215, 0, 0.7)",
        raasInner: "inset 0 0 5px rgba(255, 215, 0, 0.2)"
      },
      borderRadius: {
        raas: "1rem"
      }
    }
  },
  plugins: []
};
