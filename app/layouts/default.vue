<script setup lang="ts">
const { isLoading } = useLoadingIndicator()
const appear = ref(false)
const appeared = ref(false)

onMounted(() => {
  setTimeout(() => {
    appear.value = true
    setTimeout(() => {
      appeared.value = true
    }, 1000)
  }, 0)
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <div class="relative flex-grow">
      <HeroBackground
        class="absolute -top-px -z-10 w-full shrink-0 text-(--ui-primary) transition-all"
        :class="[
          isLoading ? 'animate-pulse' : appear ? '' : 'opacity-0',
          appeared ? 'duration-[400ms]' : 'duration-1000',
        ]"
      />
      <NuxtPage />
    </div>

    <AppFooter />
  </div>
</template>
