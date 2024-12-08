<script lang="ts" setup>
import type { Calendar } from '~/types'

const toast = useToast()
const router = useRouter()
const { calendars, activeCalendar } = useCalendars()

function editCalendar(calendar: Calendar) {
  activeCalendar.value = calendar
  router.push(`/edit/${calendar.id}`)
}

function copyToClipboard(calendar: Calendar) {
  const apiUrl = getCalendarUrl(calendar)
  const domain = window.location.origin

  navigator.clipboard.writeText(`${domain}${apiUrl}`)

  toast.add({
    title: 'Calendar URL copied',
    description: 'The calendar URL has been copied to your clipboard',
    color: 'success',
  })
}
</script>

<template>
  <button
    v-for="(calendar, index) in calendars"
    :key="index"
    type="button"
    class="flex items-center justify-between gap-2 bg-white hover:bg-slate-100 border border-gray-50 shadow dark:border-none dark:bg-slate-800 dark:hover:bg-slate-700 p-4 md:p-5 rounded-lg transition-colors duration-150 cursor-pointer"
    :aria-label="`Edit calendar: ${calendar.name}`"
    @click="editCalendar(calendar)"
  >
    <div class="text-left">
      <p class="text-xs">
        Calendar
      </p>
      <h2 class="text-lg font-semibold">
        {{ calendar.name }}
      </h2>
    </div>

    <UIcon name="i-heroicons-pencil-square" />
  </button>
</template>
