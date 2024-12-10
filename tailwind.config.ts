import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        grey: {
          50: '#f2f2f2', // Lightest
          100: '#e0e0e0',
          200: '#c7c7c7',
          300: '#a3a3a3',
          400: '#7e7e7e',
          500: '#5c5c5c', // Neutral
          600: '#404040',
          700: '#2e2e2e',
          800: '#1e1e1e',
          850: '#151515',
          900: '#0C0C0C', // Darkest
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
