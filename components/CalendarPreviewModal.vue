<script setup lang="ts">
import type { CalendarOptions, EventContentArg } from '@fullcalendar/core/index.js'
import type { VEvent } from 'node-ical'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'

const props = defineProps<{
  events: VEvent[]
}>()

const calendarEvents = computed(() => props.events.map(event => ({
  title: event.summary,
  start: event.start,
  end: event.end,
  extendedProps: {
    description: event.description,
    location: event.location,
  },
})))

const calendarOptions = computed<CalendarOptions>(() => ({
  locale: 'en',
  plugins: [timeGridPlugin],
  events: [...calendarEvents.value],
  // layout
  views: {
    timeGridThreeDays: {
      type: 'timeGrid',
      duration: { days: 3 },
      buttonText: '3 day',
    },
  },
  initialView: 'timeGridWeek',
  nowIndicator: true,
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  slotEventOverlap: true,
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  // headerToolbar: false, // TODO: disable this once we've implemented custom control buttons
  firstDay: 1, // start the week on monday
  allDaySlot: true,
  allDayText: '',
  slotDuration: '00:30:00',
  expandRows: true,
  contentHeight: 'auto',
  scrollTime: '08:00:00',
  dayHeaderFormat: { weekday: 'short', day: 'numeric', omitCommas: true },
  eventContent: eventToHTML,
}))

function eventToHTML(arg: EventContentArg) {
  const title = `<p class="text-sm font-medium line-clamp-2 break-all">${arg.event.title}</p>`
  const location = `<p class="text-xs line-clamp-1 break-all">${arg.event.extendedProps.location}</p>`
  return {
    html: `
      <div class="flex flex-col">
        ${title}
        ${arg.event.extendedProps.location ? location : ''}
      </div>
    `,
  }
}
</script>

<template>
  <UModal fullscreen>
    <template #title>
      Calendar preview
    </template>

    <template #body>
      <div>
        <FullCalendar
          :options="calendarOptions"
        />
      </div>
    </template>
  </UModal>
</template>

<style>
/* .fc-event-main {
  @apply overflow-hidden cursor-pointer;
} */

/* .fc-timegrid-event .fc-event-main {
  padding: 0px 2px 0px;
} */

/* .fc-theme-standard .fc-scrollgrid {
  border: none;
} */

/* .fc-theme-standard td, .fc-theme-standard th {
  @apply border-gray-200 dark:border-gray-700;
} */

.fc-col-header-cell-cushion {
  @apply capitalize;
  direction: rtl;
}

/* For all-day events */
/* .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
  @apply mb-0;
}
.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
  @apply min-h-0 cursor-pointer;
} */
</style>
