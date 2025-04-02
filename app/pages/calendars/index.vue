<script lang="ts" setup>
useSeoMeta({
  title: 'Calendars list - iCalFilter',
  description:
    'List of all your calendars with the number of events and the number of events that match the filtering rules.',
})

const { calendars } = useCalendars()
</script>

<template>
  <UContainer class="mt-10 flex flex-col gap-10">
    <PageHeader title="Calendars list">
      <template #actions>
        <UButton icon="i-heroicons-plus" to="/calendars/create">
          Create a new calendar
        </UButton>
      </template>
    </PageHeader>

    <ClientOnly>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <p v-if="calendars.length === 0">
          No calendars yet, start by creating one
        </p>

        <CalendarsList v-else />
      </div>

      <template #fallback>
        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>
