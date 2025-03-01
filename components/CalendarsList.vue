<script lang="ts" setup>
import type { VEvent } from 'node-ical'
import type { Calendar } from '~/types'

const router = useRouter()
const { calendars, activeCalendar } = useCalendars()

const isLoading = ref(true)
const calendarsWithCounts = ref<
  Array<Calendar & { eventsCount: number; filteredEventsCount: number }>
>([])

function editCalendar(calendar: Calendar) {
  activeCalendar.value = calendar
  router.push(`/edit/${calendar.id}`)
}

onMounted(async () => {
  for (const calendar of calendars.value) {
    const data = await $fetch(`/api/cal?url=${calendar.url}`)

    calendarsWithCounts.value.push({
      ...calendar,
      eventsCount: data?.events.length,
      filteredEventsCount: applyRulesFilters(
        data.events as unknown as VEvent[],
        calendar.rules,
      ).length,
    })
  }

  isLoading.value = false
})

function getTotalEventsCount(calendar: Calendar) {
  return (
    calendarsWithCounts.value.find((c) => c.id === calendar.id)?.eventsCount ??
    0
  )
}

function getFilteredEventsCount(calendar: Calendar) {
  return (
    calendarsWithCounts.value.find((c) => c.id === calendar.id)
      ?.filteredEventsCount ?? 0
  )
}
</script>

<template>
  <button
    v-for="(calendar, index) in calendars"
    :key="index"
    type="button"
    class="cursor-pointer rounded-lg border border-gray-50 bg-white p-4 shadow transition-colors duration-150 hover:bg-slate-100 md:p-5 dark:border-none dark:bg-slate-800 dark:hover:bg-slate-700"
    :aria-label="`Edit calendar: ${calendar.name}`"
    @click="editCalendar(calendar)"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="flex w-full flex-col gap-2 text-left">
        <h2 class="text-lg font-semibold">
          {{ calendar.name }}
        </h2>

        <div>
          <USkeleton v-if="isLoading" class="h-6 w-40" />

          <UBadge v-else variant="soft">
            matches {{ getFilteredEventsCount(calendar) }} of
            {{ getTotalEventsCount(calendar) }} events
          </UBadge>
        </div>
      </div>

      <UIcon name="i-heroicons-pencil-square" />
    </div>
  </button>
</template>
