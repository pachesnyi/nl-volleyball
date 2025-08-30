import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0070f3",
          50: "#e6f2ff",
          100: "#b3d9ff",
          200: "#80c1ff",
          300: "#4da8ff",
          400: "#1a90ff",
          500: "#0070f3",
          600: "#005cc0",
          700: "#00478e",
          800: "#00325b",
          900: "#001d29",
        },
        secondary: {
          DEFAULT: "#7828c8",
          50: "#f4e6ff",
          100: "#ddb3ff",
          200: "#c680ff",
          300: "#af4dff",
          400: "#981aff",
          500: "#7828c8",
          600: "#6020a0",
          700: "#481878",
          800: "#301050",
          900: "#180828",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
  // Important for MUI compatibility - disable CSS reset conflicts
  important: '#__next',
};

export default config;