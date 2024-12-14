<script lang="ts" setup>
const config = useRuntimeConfig()
const appVersion = config.public.appVersion
</script>

<template>
  <div class="h-24 md:h-32 px-5 md:px-52 sticky top-0 z-50 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <img
        src="/logo.png"
        class="size-8"
        aria-hidden="true"
      >

      <NuxtLink to="/">
        <h1 class="text-neutral-950 dark:text-neutral-50 text-lg md:text-2xl font-bold hover:underline">
          iCalFilter
        </h1>
      </NuxtLink>

      <UBadge
        color="primary"
        variant="subtle"
        size="sm"
      >
        v{{ appVersion }}
      </UBadge>
    </div>

    <div class="flex items-center gap-2 md:gap-4">
      <ColorModeButton />
      <GitHubButton />
    </div>
  </div>
</template>
