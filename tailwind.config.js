module.exports = {
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        display: ['EZLight', 'sans-serif'],
      },
      fontSize: {
        xxs: '.5rem',
      },
      colors: {
        'rbi-blue': '#10307f',
        'rbi-red': '#e50728',
      },
      backgroundImage: (theme) => ({
        'site-bg':
          "linear-gradient(to top, rgba(175,175,201,0.42), rgba(175,175,201,0.42)), url('/bg.jpg')",
      }),
    },
    fontFamily: {
      'ez-light': ['EZLight'],
      'ez-medium': ['EZMedium'],
      'ez-bold': ['EZBold'],
    },
  },
  variants: {
    aspectRatio: ['responsive'],
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    function ({ addBase, addComponents, theme }) {
      addBase([
        {
          '@font-face': {
            fontFamily: 'EZLight',
            src: 'url("~assets/fonts/ez-sans-light.woff2") format("woff2")',
          },
        },
        {
          '@font-face': {
            fontFamily: 'EZMedium',
            src: 'url("~assets/fonts/ez-sans-medium.woff2") format("woff2")',
          },
        },
        {
          '@font-face': {
            fontFamily: 'EZBold',
            src: 'url("~assets/fonts/ez-sans-bold.woff2") format("woff2")',
          },
        },
      ]);
    },
  ],
};
