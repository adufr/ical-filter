<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<template>
  <div
    class="flex items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2"
  >
    <h1 class="text-xl md:text-3xl font-bold">
      {{ title }}
    </h1>

    <slot />
  </div>
</template>
