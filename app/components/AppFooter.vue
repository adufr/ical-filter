<template>
  <USeparator class="h-px" />

  <UFooter :ui="{ top: 'border-b border-(--ui-border)' }">
    <template #left>
      <p class="text-sm text-(--ui-text-muted)">
        Arthur Dufour © {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </template>

    <template #right>
      <UButton
        to="https://bsky.app/profile/arthurdufour.dev"
        target="_blank"
        icon="i-simple-icons-bluesky"
        aria-label="Follow Arthur Dufour on Bluesky"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://github.com/adufr"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="Follow Arthur Dufour on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
