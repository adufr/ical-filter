<script lang="ts" setup>
useSeoMeta({
  title: 'iCal Filter',
  description: 'Add customizable filtering rules to existing iCalendar links. No account required, completely free',
})

const toast = useToast()
const router = useRouter()
const { activeCalendar } = useCalendars()

// const config = useRuntimeConfig()
// const appVersion = config.public.appVersion

function startTour() {
  toast.add({
    title: 'Not implemented yet!',
    description: 'This feature will be available soon.',
    color: 'warning',
  })
}

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
  <div>
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
              @click="createCalendar()"
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

    <div class="flex flex-col items-center justify-center gap-10">
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-2xl font-extrabold">
          Why iCalFilter?
        </h2>
        <p>
          These are the reasons why iCalFilter is the best way to filter events from any iCalendar feed.
        </p>
      </div>

      <div class="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <LandingCard
          icon="i-heroicons-rocket-launch"
          title="Powerful filtering"
          description="Customizable filtering rules, supports regex"
        />
        <!-- <LandingCard
          icon="i-heroicons-calendar"
          title="Events preview"
          description="Preview events to help filtering"
        /> -->
        <LandingCard
          icon="i-heroicons-user"
          title="No account required"
          description="No account required, completely free"
        />
        <LandingCard
          icon="i-heroicons-lock-closed"
          title="Privacy built-in"
          description="All data is stored locally in your browser"
        />
        <LandingCard
          icon="i-heroicons-check"
          title="Free and open-source"
          description="No ads, all code is available on GitHub"
        />
      </div>
    </div>
  </div>
</template>
