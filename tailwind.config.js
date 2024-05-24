/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    colors: {
      'primary': '#000000',
      'primaryhover': '#808080',
      'background': '#f8fafc',
      'surface': '#ffffff',
      'border': '#EDEDED',
      'delete': '#ad0000',
      'delete-light': '#b91c1c',
      'update-light': '#008f0a',
      'update': '#008f0a',
      'ai': '#7e22ce'
    },
    extend: {},
  },
  plugins: [],
}

