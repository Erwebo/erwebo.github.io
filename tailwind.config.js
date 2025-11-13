/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#BF0404",
        ez: {
          red: "#BF0404",
          black: "#000000",
          gray: "#414042",
          white: "#FFFFFF",
        }
      },
    },
  },
  plugins: [],
};