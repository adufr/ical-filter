<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const appVersion = runtimeConfig.public.appVersion;
</script>

<template>
  <p class="text-sm">
    Built with ❤️ by
    <a
      href="https://arthurdufour.dev"
      target="_blank"
      class="underline"
      aria-label="Open arthurdufour.dev in a new tab"
      >Arthur Dufour</a
    >
  </p>

  <span class="font-extrabold" aria-hidden="true">●</span>

  <p class="text-sm">version {{ appVersion }}</p>
</template>
