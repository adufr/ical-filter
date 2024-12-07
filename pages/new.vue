<script lang="ts" setup>
definePageMeta({
  title: 'New calendar - iCalFilter',
  description: 'Create a new calendar',
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

    <ClientOnly>
      <CalendarForm />

      <template #fallback>
        <div class="flex justify-center items-center h-full">
          <UIcon name="i-svg-spinners-270-ring-with-bg" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
