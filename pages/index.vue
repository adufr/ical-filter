<script lang="ts" setup>
definePageMeta({
  title: 'Calendars - iCalFilter',
  description: 'Manage your calendars',
})

const router = useRouter()
const { calendars, activeCalendar } = useCalendars()

function createCalendar() {
  activeCalendar.value = {
    id: crypto.randomUUID(),
    name: '',
    url: '',
    rules: [],
  }

  router.push('/new')
}
</script>

<template>
  <div class="h-full flex flex-col gap-5">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-2xl font-bold">
        Calendars list
      </h2>

      <UButton
        icon="i-heroicons-plus"
        color="neutral"
        variant="soft"
        size="sm"
        @click="createCalendar()"
      >
        Create a new calendar
      </UButton>
    </div>

    <div>
      <div v-if="calendars.length === 0">
        <p>
          You don't have any calendars yet.
        </p>
      </div>

      <CalendarsList v-else />
    </div>
  </div>
</template>
