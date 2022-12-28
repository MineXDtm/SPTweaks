/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/**/*.{html,js,svelte,ts}'],
  theme: {

    // screens:{
    //   "lg":{"max":"992px"},
    //   "md":{"max":"768px"},
    //   "sm":{"max":"480px"}
    // },

    container: {
      padding: "28px",

      center: true
    },
    extend: {
      boxShadow: {
        'C_shadow': '0 0px 60px -10px rgba(255, 255, 255, 0.3)',
      },



    }
  },
  prefix: 'tw-',
  important: true,
  plugins: [],
}
