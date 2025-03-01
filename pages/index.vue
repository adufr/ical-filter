<script lang="ts" setup>
useSeoMeta({
  title: 'iCalFilter',
  description:
    'Add customizable filtering rules to existing iCalendar links. No account required, completely free',
})

const accordionItems = ref([
  {
    icon: 'i-heroicons-question-mark-circle',
    label: 'What problem does this solve?',
    content:
      'iCalFilter addresses the issue of iCalendar feeds that include too many events, making it difficult to focus on what matters to you. With iCalFilter, you can apply custom filtering rules to extract only the events that match your criteria, while still benefiting from live updates.\nThis ensures you receive just the information you need, without losing the convenience of dynamic calendar synchronization.',
  },
  {
    icon: 'i-heroicons-cog',
    label: 'How does it work?',
    content:
      'Simply provide your existing iCalendar URL and define your filtering rules. iCalFilter generates a new URL with all your settings encoded. When this URL is accessed, it fetches your original iCalendar feed, applies your rules to filter the events, and produces a tailored iCalendar feed. You can then import this new URL into your favorite calendar app, and it will automatically stay up-to-date with your customized feed.',
  },
])
</script>

<template>
  <div class="flex flex-col gap-20 md:gap-40">
    <div
      class="mt-14 flex items-center justify-center sm:mt-24 md:mt-32 md:mb-10"
    >
      <div class="flex flex-col items-center gap-8 text-center md:gap-10">
        <h1 class="text-4xl font-extrabold md:text-5xl">
          Filter events from<br />
          <span class="text-primary-500">any iCalendar feed</span>
        </h1>

        <p>
          Add customizable filtering rules to existing iCalendar links<br />
          No account required, completely free
        </p>

        <div class="flex flex-col items-center gap-2">
          <div class="flex flex-col items-center gap-2 md:flex-row">
            <UButton icon="i-heroicons-plus" color="primary" to="/new">
              Create a calendar
            </UButton>

            <UButton
              leading-icon="i-heroicons-arrow-right"
              color="neutral"
              variant="soft"
              to="/list"
            >
              See your calendars
            </UButton>
          </div>

          <div class="mt-2">
            <p class="text-xs text-slate-400">
              Built with ❤️ by
              <a
                href="https://arthurdufour.dev"
                target="_blank"
                class="underline"
                >Arthur Dufour</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center gap-10">
      <div class="flex flex-col items-center gap-2 text-center">
        <h2 class="text-2xl font-extrabold">Why iCalFilter?</h2>
        <p>
          These are the reasons why iCalFilter is the best way to filter events
          from any iCalendar feed.
        </p>
      </div>

      <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <LandingCard
          icon="i-heroicons-rocket-launch"
          title="Powerful filtering"
          description="Customizable filtering rules, supports regex"
        />
        <LandingCard
          icon="i-heroicons-calendar"
          title="Events preview"
          description="Preview events to help filtering"
        />
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

    <div
      class="mb-20 flex flex-col items-center justify-center gap-10 md:mb-40"
    >
      <div class="flex flex-col items-center gap-2 text-center">
        <h2 class="text-2xl font-extrabold">Frequently asked questions</h2>
        <p>Here are some frequently asked questions about iCalFilter.</p>
      </div>

      <UAccordion
        :items="accordionItems"
        class="max-w-3xl whitespace-pre-line"
      />
    </div>
  </div>
</template>
