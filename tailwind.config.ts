import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./store/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#2E6F68",
          "teal-light": "#3a8a82",
          sand: "#C9B79C",
          paper: "#FAFAF7",
          ink: "#2B2B2B",
          muted: "#6E6E6E",
          moss: "#6B8E5A",
          brown: "#9B6F4D",
          border: "#EAEAEA"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-inter-tight)", "Inter Tight", "sans-serif"],
        editorial: ["var(--font-serif)", "Cormorant Garamond", "serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(46, 111, 104, 0.12)",
        lift: "0 18px 45px rgba(43, 43, 43, 0.10)"
      },
      borderRadius: { brand: "8px" }
    }
  },
  plugins: []
};

export default config;
