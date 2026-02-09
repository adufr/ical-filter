<script lang="ts" setup>
useSeoMeta({
  title: 'Edit calendar - iCalFilter',
  description: 'Edit your calendar, add or remove rules, and save the changes.',
})

const route = useRoute()
const { activeCalendar, calendars } = useCalendars()

onMounted(() => {
  const calendar = calendars.value.find((c) => c.id === route.params.id)
  if (calendar) {
    activeCalendar.value = {
      ...calendar,
      rules: calendar.rules ?? [],
      replacements: calendar.replacements ?? [],
    }
  } else {
    navigateTo('/calendars/create')
  }
})
</script>

<template>
  <UContainer class="mt-10 flex flex-col gap-10">
    <PageHeader
      title="Edit calendar"
      :link="{ to: '/calendars', label: 'Back to calendars list' }"
    />

    <ClientOnly>
      <CalendarForm mode="edit" />

      <template #fallback>
        <div class="flex h-full items-center justify-center">
          <UIcon name="i-svg-spinners-270-ring-with-bg" />
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>
