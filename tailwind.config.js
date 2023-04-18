/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Roboto Mono", "sans-serif"],
    },
    backgroundColor: {
      d82881: "#d82881",
      "8d27da": "#8d27da",
    },
    animation: {
      stargazing: "stargazing 3s 1.2s forwards cubic-bezier(0.2, 0.8, 0.2, 1)",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
