<script lang="ts" setup>
definePageMeta({
  title: 'New calendar - iCalFilter',
  description: 'Create a calendar',
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <PageHeader title="Create a calendar">
      <UButton
        to="/list"
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="soft"
        size="sm"
      >
        Back to calendars list
      </UButton>
    </PageHeader>

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
