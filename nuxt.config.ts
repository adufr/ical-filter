/* eslint-disable node/prefer-global/process */
import { defineOrganization } from 'nuxt-schema-org/schema'

import pkgJson from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui-pro',
    '@vueuse/nuxt',
    '@nuxthub/core',
    '@nuxtjs/plausible',
    '@nuxt/test-utils/module',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: { name: 'slide', mode: 'out-in' },
  },

  routeRules: {
    '/': { prerender: true },
  },

  runtimeConfig: {
    public: {
      nodeEnv: process.env.NODE_ENV,
      appVersion: pkgJson.version,
    },
  },

  future: {
    compatibilityVersion: 4,
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

  // SEO related packages
  site: {
    url: 'https://ical-filter.arthurdufour.dev',
    name: 'iCalFilter',
  },
  routeRules: {
    // Don't add any /secret/** URLs to the sitemap.xml
    '/calendars/edit/**': { robots: false },
  },
  schemaOrg: {
    identity: defineOrganization({
      // Basic Information
      name: 'iCalFilter',
      logo: '/logo.png',
    }),
  },
})
