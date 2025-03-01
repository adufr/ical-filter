<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div
    class="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2 dark:border-neutral-800"
  >
    <h1 class="text-xl font-bold md:text-3xl">
      {{ title }}
    </h1>

    <slot />
  </div>
</template>
