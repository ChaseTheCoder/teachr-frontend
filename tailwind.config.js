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
      'primary-variant': '#000000',
      'background': '#f8fafc',
      'surface': '#ffffff',
      'border': '#EDEDED'
    },
    extend: {},
  },
  plugins: [],
}
