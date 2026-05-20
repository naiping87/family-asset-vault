/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'desktop': '1024px',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.65)',
          'light-intense': 'rgba(255, 255, 255, 0.85)',
          'light-subtle': 'rgba(255, 255, 255, 0.40)',
          dark: 'rgba(15, 23, 42, 0.70)',
          'dark-intense': 'rgba(15, 23, 42, 0.88)',
          'dark-subtle': 'rgba(15, 23, 42, 0.45)',
        },
        brand: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          dark: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};
