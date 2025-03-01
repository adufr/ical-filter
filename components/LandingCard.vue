<script lang="ts" setup>
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <UCard class="w-full transition-all duration-200 hover:scale-[1.02]">
    <div class="flex flex-col gap-4">
      <div
        class="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
        :aria-label="title"
      >
        <UIcon :name="icon" class="size-5" aria-hidden="true" />
      </div>

      <div class="space-y-1">
        <h3 class="font-bold">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ description }}
        </p>
      </div>
    </div>
  </UCard>
</template>
