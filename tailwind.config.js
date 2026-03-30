/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        verdefluor: "#10db00",
        verdefluort: "#00a002",
        curso: "#fff000 ",
        terminado: "#f1f1f1",
        verdepanel: "#108f45",
        tabla: "#1f2c26",
        fondo2: "#00a002",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "icon-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "fade-in-up-delay-1": "fade-in-up 0.45s ease-out 0.1s forwards",
        "fade-in-up-delay-2": "fade-in-up 0.45s ease-out 0.2s forwards",
        "fade-in": "fade-in 0.35s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "scale-in-delay-1": "scale-in 0.4s ease-out 0.06s forwards",
        "scale-in-delay-2": "scale-in 0.4s ease-out 0.12s forwards",
        "icon-pulse": "icon-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
