import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta institucional azul-escuro (navy) — séria, com presença.
        brand: {
          50: "#eef3fa",
          100: "#dbe6f4",
          200: "#bcd0ea",
          300: "#8fadd5",
          400: "#5c80b8",
          500: "#385f9b",
          600: "#264a80",
          700: "#1b3866",
          800: "#152b4f",
          900: "#101f3a",
          950: "#0a1428",
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
      boxShadow: {
        card: "0 1px 2px 0 rgb(16 31 58 / 0.04), 0 1px 3px 0 rgb(16 31 58 / 0.06)",
        "card-hover":
          "0 4px 12px -2px rgb(16 31 58 / 0.10), 0 2px 6px -2px rgb(16 31 58 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
