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
          // Accessibility (audit 2026-07-14, A11Y-03): a deeper gold used ONLY
          // for text/links on light backgrounds — 5.03:1 on white / 4.68:1 on
          // gray-bg (WCAG AA). `gold.dark` stays the button-hover/border color
          // so brand buttons are unchanged; only faint gold *text* darkens.
          deep: "#8C6A00",
        },
        gray: {
          bg: "#F5F7FA",
          dark: "#1A1A1A",
        },
        success: "#27AE60",
        // Accessibility (A11Y-05): accessible green for text/icons on white
        // (5.02:1). `success` (#27AE60) stays for fills/backgrounds.
        "success-dark": "#15803D",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
