<script lang="ts" setup>
definePageMeta({
  title: 'List - iCalFilter',
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
  <div class="flex flex-col gap-5">
    <PageHeader title="Calendars list">
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        @click="createCalendar()"
      >
        Create a new calendar
      </UButton>
    </PageHeader>

    <ClientOnly>
      <div v-if="calendars.length === 0">
        <p>
          You don't have any calendars yet.
        </p>
      </div>

      <CalendarsList v-else />

      <template #fallback>
        <div class="flex justify-center items-center h-full">
          <UIcon name="i-svg-spinners-270-ring-with-bg" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
