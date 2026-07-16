/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: { 50: '#f2fbf4', 500: '#2e9b63', 700: '#167346' },
      },
    },
  },
  plugins: [],
};
