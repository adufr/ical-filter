<script lang="ts" setup>
useSeoMeta({
  title: 'iCal Filter',
  description: 'Add customizable filtering rules to existing iCalendar links. No account required, completely free',
})

const toast = useToast()

// const config = useRuntimeConfig()
// const appVersion = config.public.appVersion

function startTour() {
  toast.add({
    title: 'Not implemented yet!',
    description: 'This feature will be available soon.',
    color: 'warning',
  })
}
</script>

<template>
  <div class="h-screen -mt-20 md:-mt-32 flex items-center justify-center">
    <div class="flex flex-col items-center text-center gap-8 md:gap-10">
      <!-- <UBadge
        color="primary"
        variant="subtle"
        size="lg"
        class="rounded-full"
      >
        Version {{ appVersion }}
      </UBadge> -->

      <h1 class="text-4xl md:text-5xl font-extrabold">
        Filter events from<br>
        <span class="text-primary-500">any iCalendar feed</span>
      </h1>

      <p>
        Add customizable filtering rules to existing iCalendar links<br>
        No account required, completely free
      </p>

      <div class="flex flex-col items-center gap-2">
        <div class="flex flex-col md:flex-row items-center gap-2">
          <UButton
            icon="i-heroicons-plus"
            color="primary"
            to="/new"
          >
            Create a calendar
          </UButton>

          <UButton
            leading-icon="i-heroicons-arrow-right"
            color="neutral"
            variant="ghost"
            @click="startTour()"
          >
            See how to use it
          </UButton>
        </div>

        <UButton
          variant="link"
          color="neutral"
          size="sm"
          to="/list"
        >
          Already have calendars? Manage them here
        </UButton>
      </div>

      <div>
        <p class="text-sm">
          Built with ❤️ by <a
            href="https://arthurdufour.dev"
            target="_blank"
            class="hover:underline"
          >Arthur Dufour</a>
        </p>
      </div>
    </div>
  </div>
</template>
