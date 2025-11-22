import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#050510",
          900: "#08071d",
          800: "#0d0b2d",
          700: "#141346",
          600: "#1a1d60"
        },
        accent: {
          500: "#6a5acd",
          400: "#8e7dff",
          300: "#b3a7ff"
        }
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(142, 125, 255, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
