/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        verdefluor: "#10db00",
        verdepanel: "##108f4580",
      },
    },
  },
  plugins: [],
};
