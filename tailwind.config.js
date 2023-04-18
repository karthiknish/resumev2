/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
        mono: ["Fira Code", "Menlo", "Courier New", "monospace"],
        display: ["Poppins", "Arial", "sans-serif"],
        body: ["Nunito", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
