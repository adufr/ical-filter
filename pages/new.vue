<script lang="ts" setup>
definePageMeta({
  title: 'New calendar - iCalFilter',
  description: 'Create a new calendar',
  pageTransition: {
    name: 'slide',
    mode: 'out-in',
  },
})
</script>

<template>
  <div class="h-full flex flex-col gap-5">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-2xl font-bold">
        Create your calendar
      </h2>

      <UButton
        to="/"
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="soft"
        size="sm"
      >
        Back to calendars list
      </UButton>
    </div>

    <CalendarForm />
  </div>
</template>
