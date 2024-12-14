<script lang="ts" setup>
useSeoMeta({
  title: 'Calendars list - iCalFilter',
  description: 'List of all your calendars with the number of events and the number of events that match the filtering rules.',
})

const { calendars } = useCalendars()
</script>

<template>
  <div class="flex flex-col gap-5">
    <PageHeader title="Calendars list">
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        to="/new"
      >
        Create a new calendar
      </UButton>
    </PageHeader>

    <ClientOnly>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <p v-if="calendars.length === 0">
          No calendars yet, start by creating one
        </p>

        <CalendarsList v-else />
      </div>

      <template #fallback>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
          <USkeleton class="h-24 animate-pulse" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
