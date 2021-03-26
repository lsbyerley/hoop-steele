require('dotenv').config();
import path from 'path';

export default {
  /*
   ** Rendering mode
   ** Doc: https://nuxtjs.org/api/configuration-mode
   */
  ssr: false,
  target: 'static',
  env: {
    API_HOST: process.env.API_HOST,
    API_V: process.env.API_V,
  },

  components: true,

  /*
   ** For Netlify deploy
   ** Doc: https://nuxtjs.org/faq/netlify-deployment/#for-site-generated-in-spa-mode
   */
  generate: {
    fallback: true,
  },

  /*
   ** Headers of the page
   ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
   */
  head: {
    title: 'SteeleHoops - Beat the Bookie',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Compare college basketball team rankings and ratings to help yourself beat the bookie',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Global CSS
   ** Doc: https://nuxtjs.org/api/configuration-css
   */
  css: [
    /* '~/assets/styles/app.css' */
  ],

  /*
   ** Plugins to load before mounting the App
   ** Doc: https://nuxtjs.org/guide/plugins
   */
  plugins: ['~/plugins/project-apis'],

  /*
   ** Nuxt.js modules
   ** Doc: https://nuxtjs.org/guide/modules
   */
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    '@nuxtjs/axios',
  ],

  buildModules: ['@nuxt/postcss8', '@nuxtjs/tailwindcss'],
  tailwindcss: {
    jit: true,
  },
};
