/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Pedimos observar cualquier archivo con extesión "js,jsx,ts,tsx,vue"
    // que esté en src/ o cualquierade sus sub-carpetas (**/).
    "./src/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      height: {
        // Registramos la clase h-25
        '25': '6.25rem',
      },
      gridTemplateRows: {
        'layout': '64px 1fr 100px',
      }
    },
  },
  plugins: [],
}

