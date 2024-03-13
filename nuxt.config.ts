// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ['@nuxtjs/i18n', 'nuxt-svgo', '@pinia/nuxt', '@vueuse/nuxt'],
  css: ['@/assets/style/app.scss'],
  app: {
    baseURL: '/',
    head: {
      title: 'Cardia',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        { name: 'content-language', content: 'sv' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      noscript: [{ children: 'Activate JavaScript in your browser' }],
    },
  },
  runtimeConfig: {
    BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || '',
    BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME || '',
    BASIC_AUTH: process.env.BASIC_AUTH === 'ENABLE',
    DOMAIN_MAP_FILE: process.env.DOMAIN_MAP_FILE || '',
    public: {
      API_BASE_URL: process.env.API_BASE_URL || '',
    },
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.ts',
      },
      {
        code: 'sv',
        file: 'sv.ts',
      },
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'sv',
    experimental: {
      jsTsFormatResource: true,
    },
  },
});
