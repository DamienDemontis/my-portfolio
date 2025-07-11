/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      colors: {
        'accent-light': '#3b82f6',
        'accent-dark': '#60a5fa',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary": "#60a5fa",
          "primary-focus": "#3b82f6",
          "base-100": "#1d232a",
        },
      },
    ],
    darkTheme: "dark",
  },
} 