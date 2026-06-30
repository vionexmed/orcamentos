import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta institucional azul-escuro (navy) — séria e com presença.
        brand: {
          50: "#eef3fa",
          100: "#d6e2f2",
          200: "#aec6e4",
          300: "#7fa3d2",
          400: "#5680bb",
          500: "#2f5996",
          600: "#1d3f72",
          700: "#15315a",
          800: "#0f2546",
          900: "#0a1a33",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
