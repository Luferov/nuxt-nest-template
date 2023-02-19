// import pugPlugin from 'vite-plugin-pug'
import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/css/tailwind.css', 'vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/robots',
    '@nuxtjs/color-mode',
    '@nuxtjs/apollo',
    '@nuxt/devtools',
  ],
  // @ts-ignore
  apollo: {
    clients: {
      default: './graphql/client.ts',
    },
  },
  i18n: {
    lazy: true,
    langDir: 'assets/lang/',
    defaultLocale: 'ru',
    detectBrowserLanguage: false,
    locales: [
      { code: 'ru', file: 'ru.json' },
      { code: 'en', file: 'en.json' },
    ],
  },
  vite: {
    plugins: [eslintPlugin()],
  },
  build: {
    transpile: ['vuetify'],
  },
})
