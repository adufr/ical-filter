<script lang="ts" setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

defineShortcuts({
  meta_shift_l: () => {
    isDark.value = !isDark.value
  },
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UTooltip
      :kbds="['meta', 'shift', 'l']"
      :text="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <UButton
        :icon="
          isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
        "
        color="neutral"
        variant="ghost"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="isDark = !isDark"
      />
    </UTooltip>

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
