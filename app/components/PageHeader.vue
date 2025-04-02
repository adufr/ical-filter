<script lang="ts" setup>
defineProps<{
  title: string
  link?: {
    to: string
    label: string
  }
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <ULink v-if="link" :to="link.to" class="flex items-center gap-1">
      <UIcon name="i-heroicons-arrow-left" />
      <p class="text-sm font-semibold">
        {{ link.label }}
      </p>
    </ULink>

    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold md:text-3xl">
        {{ title }}
      </h1>

      <slot name="actions" />
    </div>

    <USeparator class="mt-3" />
  </div>
</template>
