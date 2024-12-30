/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',
      },
    },
  },
  plugins: [require("daisyui")],
}
