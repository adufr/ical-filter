<script setup lang="ts">
useSeoMeta({
  title: 'iCalFilter',
  ogTitle: 'iCalFilter',
  description: 'iCalFilter',
  ogDescription: 'iCalFilter',
})
</script>

<template>
  <div class="relative">
    <UPageHero
      :ui="{ container: 'md:pt-28 lg:pt-40' }"
      :links="[
        {
          label: 'Create a calendar',
          icon: 'i-lucide-plus',
          color: 'primary',
          to: '/calendars/create',
          size: 'lg',
        },
        {
          label: 'See your calendars',
          icon: 'i-lucide-arrow-right',
          color: 'neutral',
          to: '/calendars',
          variant: 'soft',
          size: 'lg',
        },
      ]"
    >
      <template #title>
        <h1 class="mx-auto max-w-3xl text-4xl font-extrabold lg:text-6xl">
          Filter events from<br />
          <span class="text-(--ui-primary)">any iCalendar feed</span>
        </h1>
      </template>

      <template #description>
        <p>
          Add customizable filtering rules to existing iCalendar links.<br />
          No account required, completely free
        </p>
      </template>

      <div
        class="absolute left-1/2 size-40 -translate-x-1/2 -translate-y-80 transform rounded-full blur-[250px] sm:size-50 dark:bg-(--ui-primary)"
      />

      <StarsBg />
    </UPageHero>

    <USeparator :ui="{ border: 'border-(--ui-primary)/30' }" />

    <UPageSection
      id="features"
      :features="[
        {
          icon: 'i-heroicons-rocket-launch',
          title: 'Powerful filtering',
          description:
            'Customizable filtering rules, supports regular expressions',
        },
        {
          icon: 'i-heroicons-calendar',
          title: 'Events preview',
          description:
            'Preview events to help you understand the filtering rules',
        },
        {
          icon: 'i-heroicons-user',
          title: 'No account required',
          description: 'No account required, completely free',
        },
        {
          icon: 'i-heroicons-lock-closed',
          title: 'Privacy focused',
          description: 'Your data is yours, we don\'t store your data',
        },
        {
          icon: 'i-heroicons-check',
          title: 'Open source',
          description:
            'iCalFilter is open source, you can see the code and contribute to it',
        },
      ]"
      :ui="{
        title: 'text-left @container relative flex',
        description: 'text-left',
      }"
      class="relative overflow-hidden"
    >
      <div
        class="absolute top-10 -left-10 z-10 size-[300px] rounded-full bg-(--ui-primary) opacity-30 blur-[200px]"
      />
      <div
        class="absolute -right-10 -bottom-10 z-10 size-[300px] rounded-full bg-(--ui-primary) opacity-30 blur-[200px]"
      />
      <template #title>
        <h2 class="*:leading-9">What can iCalFilter do?</h2>
      </template>

      <template #description>
        <p>
          These are the reasons why iCalFilter is the best way to filter events
          from any iCalendar feed.
        </p>
      </template>
    </UPageSection>

    <USeparator :ui="{ border: 'border-(--ui-primary)/30' }" />

    <UPageSection id="faq" class="relative overflow-hidden">
      <template #title>
        <h2 class="*:leading-9">Frequently asked questions</h2>
      </template>

      <template #description>
        <p>Here are some questions you might have about iCalFilter.</p>
      </template>

      <div class="mx-auto w-full max-w-3xl">
        <UAccordion
          class="whitespace-pre-line"
          :items="[
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
            {
              icon: 'i-heroicons-lock-closed',
              label: 'Where\'s my data stored?',
              content:
                'Your data is yours, we don\'t store your data. All data is stored in your browser\'s local storage.',
            },
          ]"
        />
      </div>
    </UPageSection>

    <USeparator />
  </div>
</template>
