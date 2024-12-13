<script setup lang="ts">
const { copyCalendarLink } = useCalendars()
</script>

<template>
  <UModal>
    <template #title>
      Calendar saved!
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <div>
          <p>Your calendar has successfully been saved!</p>
        </div>

        <!-- <UAlert
          color="primary"
          variant="soft"
          title="How to integrate your calendar?"
          description="Click here to see how to integrate your calendar with your favorite calendar app."
          icon="i-lucide-calendar"
        /> -->
      </div>
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-arrow-left"
        to="/list"
        @click="useModal().close()"
      >
        Go to calendars list
      </UButton>
      <UButton
        icon="i-lucide-copy"
        variant="soft"
        @click="copyCalendarLink()"
      >
        Copy calendar URL
      </UButton>
    </template>
  </UModal>
</template>
