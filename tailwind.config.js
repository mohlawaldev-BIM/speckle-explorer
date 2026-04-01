/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        speckle: {
          50:  '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#0c8ee0',
          600: '#006ebf',
          700: '#00569a',
          800: '#04487f',
          900: '#0a3d6a',
          950: '#072849',
        },
      },
    },
  },
  plugins: [],
}
