<script lang="ts" setup>
definePageMeta({
  title: 'Edit calendar - iCalFilter',
  description: 'Edit your calendar',
})

const route = useRoute()
const { activeCalendar, calendars } = useCalendars()

onMounted(() => {
  if (!activeCalendar.value.id) {
    const calendar = calendars.value.find(cal => cal.id === route.params.id)
    if (calendar) {
      activeCalendar.value = calendar
    }
    else {
      navigateTo('/')
    }
  }
})
</script>

<template>
  <div class="h-full flex flex-col gap-5">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-2xl font-bold">
        Edit calendar
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
