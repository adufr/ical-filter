<script setup lang="ts">
const appVersion = useRuntimeConfig().public.appVersion

const nuxtApp = useNuxtApp()
const { activeHeadings, updateHeadings } = useScrollspy()
const route = useRoute()

const items = computed(() => {
  if (route.path === '/') {
    return [
      {
        label: 'Features',
        to: '#features',
        active:
          activeHeadings.value.includes('features') &&
          !activeHeadings.value.includes('faq'),
      },
      {
        label: 'FAQ',
        to: '#faq',
        active:
          activeHeadings.value.includes('faq') &&
          !activeHeadings.value.includes('features'),
      },
    ]
  }

  return []
})

nuxtApp.hooks.hookOnce('page:finish', () => {
  updateHeadings(
    [
      document.querySelector('#features'),
      document.querySelector('#faq'),
    ].filter(Boolean) as Element[],
  )
})
</script>

<template>
  <UHeader>
    <template #left>
      <div class="flex items-center gap-2">
        <img src="/logo.png" class="size-8" aria-hidden="true" />

        <NuxtLink to="/">
          <h1
            class="text-lg font-bold text-neutral-950 hover:underline md:text-2xl dark:text-neutral-50"
          >
            iCalFilter
          </h1>
        </NuxtLink>

        <UBadge color="primary" variant="subtle" size="sm">
          v{{ appVersion }}
        </UBadge>
      </div>
    </template>

    <template #right>
      <UNavigationMenu :items="items" variant="link" class="hidden lg:block" />

      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      <UButton
        class="mt-4"
        label="Create a calendar"
        variant="subtle"
        to="/calendars/create"
        block
      />
    </template>
  </UHeader>
</template>
