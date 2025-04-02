<script lang="ts" setup>
useSeoMeta({
  title: 'New calendar - iCalFilter',
  description:
    'Create a calendar with a custom name and URL, and add filtering rules.',
})
</script>

<template>
  <UContainer class="mt-10 flex flex-col gap-10">
    <PageHeader
      title="Create a calendar"
      :link="{ to: '/calendars', label: 'Back to calendars list' }"
    />

    <ClientOnly>
      <CalendarForm mode="new" />

      <template #fallback>
        <div class="flex h-full items-center justify-center">
          <UIcon name="i-svg-spinners-270-ring-with-bg" />
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>
