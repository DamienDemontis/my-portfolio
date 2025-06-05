import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7c3aed',
          dark: '#a78bfa',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
