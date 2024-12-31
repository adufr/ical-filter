<script lang="ts" setup>
useSeoMeta({
  title: 'Edit calendar - iCalFilter',
  description: 'Edit your calendar, add or remove rules, and save the changes.',
})

const route = useRoute()
const { activeCalendar, calendars } = useCalendars()

if (!activeCalendar.value.id) {
  const calendar = calendars.value.find(cal => cal.id === route.params.id)
  if (calendar) {
    activeCalendar.value = calendar
  }
  else {
    navigateTo('/new')
  }
}

defineShortcuts({
  escape: () => {
    navigateTo('/list')
  },
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <PageHeader title="Edit calendar">
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
      <CalendarForm mode="edit" />

      <template #fallback>
        <div class="flex justify-center items-center h-full">
          <UIcon name="i-svg-spinners-270-ring-with-bg" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
