/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Arial', 'Helvetica', 'sans-serif'],
        syncopate: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
