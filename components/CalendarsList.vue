<script lang="ts" setup>
import type { Calendar } from '~/types'

const toast = useToast()
const router = useRouter()
const { calendars, activeCalendar } = useCalendars()

function editCalendar(calendar: Calendar) {
  activeCalendar.value = calendar
  router.push(`/edit/${calendar.id}`)
}

function deleteCalendar(calendar: Calendar) {
  calendars.value = calendars.value.filter(cal => cal.id !== calendar.id)

  // TODO: add an undo button
  toast.add({
    title: 'Calendar deleted',
    description: 'The calendar has been deleted',
    color: 'success',
  })
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
  <ul class="flex flex-col gap-2">
    <li
      v-for="(calendar, index) in calendars"
      :key="index"
      class="flex items-center justify-between gap-2 border border-gray-300 dark:border-gray-700 pl-4 rounded-lg"
    >
      <p class="py-1">
        {{ calendar.name }}
      </p>

      <UButtonGroup class="h-full">
        <UButton
          icon="i-heroicons-clipboard-document-list"
          variant="soft"
          color="neutral"
          class="hover:cursor-pointer"
          @click="copyToClipboard(calendar)"
        />
        <UButton
          icon="i-heroicons-pencil"
          variant="soft"
          color="neutral"
          class="hover:cursor-pointer"
          @click="editCalendar(calendar)"
        />
        <UButton
          icon="i-heroicons-trash"
          variant="soft"
          color="neutral"
          class="hover:cursor-pointer"
          @click="deleteCalendar(calendar)"
        />
      </UButtonGroup>
    </li>
  </ul>
</template>
