<script lang="ts" setup>
const config = useRuntimeConfig()
const appVersion = config.public.appVersion
</script>

<template>
  <div
    class="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 bg-white/70 px-5 backdrop-blur md:px-52 dark:border-slate-800 dark:bg-slate-900/70"
  >
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

    <div class="flex items-center gap-2 md:gap-4">
      <ColorModeButton />
      <GitHubButton />
    </div>
  </div>
</template>
