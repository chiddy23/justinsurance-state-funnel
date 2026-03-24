import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B3A6B",
          light: "#2A4F8F",
          dark: "#122850",
        },
        gold: {
          DEFAULT: "#F5A623",
          light: "#F7B84E",
          dark: "#D4901A",
        },
        gray: {
          bg: "#F5F7FA",
          dark: "#1A1A1A",
        },
        success: "#27AE60",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
