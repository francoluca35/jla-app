/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        verdefluor: "#10db00",
        verdefluort: "#10db0030",
        verdepanel: "#108f45",
      },
    },
  },
  plugins: [],
};
