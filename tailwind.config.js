/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    'node_modules/daisyui/dist/**/*.js', 
    'node_modules/react-daisyui/dist/**/*.js'
  ],
  daisyui: {
    themes: ['dark', 'light']
  },
  theme: {
    extend: {
      height: {
        screen: ['100vh /* fallback for Firefox, IE and etc. */', '100dvh'],
        "screen-small": ['100vh /* fallback for Firefox, IE and etc. */', '100svh'],
        "screen-large": ['100vh /* fallback for Firefox, IE and etc. */', '100lvh'],
      }
    },
  },
  plugins: [require('daisyui')]
}
