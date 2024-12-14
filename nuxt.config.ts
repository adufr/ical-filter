/* eslint-disable node/prefer-global/process */
import pkgJson from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxthub/core',
    '@nuxtjs/plausible',
    '@nuxt/test-utils/module',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: { name: 'slide', mode: 'out-in' },
  },

  typescript: {
    typeCheck: false,
  },

  runtimeConfig: {
    public: {
      nodeEnv: process.env.NODE_ENV,
      appVersion: pkgJson.version,
    },
  },

  plausible: {
    domain: 'ical-filter.arthurdufour.dev',
    apiHost: 'https://plausible.arthurdufour.dev',
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  site: {
    url: 'https://ical-filter.arthurdufour.dev',
    name: 'iCalFilter',
  },

  routeRules: {
    // Don't add any /secret/** URLs to the sitemap.xml
    '/edit/**': { robots: false },
  },
})
