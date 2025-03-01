<script lang="ts" setup>
const toast = useToast()

function startTour() {
  toast.add({
    title: 'Not implemented yet!',
    description: 'This feature will be available soon.',
    color: 'warning',
  })
}
</script>

<template>
  <div class="grid h-screen w-screen grid-cols-5 gap-4 p-4">
    <!-- ---------------------------------------------------- -->
    <!-- left side: menu -->
    <!-- ---------------------------------------------------- -->
    <div
      class="bg-primary-700 col-span-5 rounded-xl p-4 text-white md:col-span-2 md:p-14"
    >
      <div class="flex h-full flex-col justify-between gap-4">
        <div class="flex items-center justify-between gap-2">
          <h1 class="text-lg font-bold md:text-2xl">iCalFilter</h1>

          <ColorModeButton />
        </div>

        <div class="flex flex-col gap-5 text-center md:text-left">
          <p class="text-xl font-bold md:text-4xl">
            Filter events from<br />any iCalendar feed
          </p>

          <p class="md:text-lg">
            Add customizable filtering rules to existing iCalendar links
          </p>

          <div>
            <UButton
              leading-icon="i-heroicons-arrow-right"
              variant="ghost"
              class="text-white"
              @click="startTour()"
            >
              See how to use it
            </UButton>
          </div>
        </div>

        <!-- TODO: carousel testimonials -->

        <div
          class="bg-primary-800 flex items-center justify-center gap-2 rounded-xl p-2"
        >
          <AppFooter class="" />
        </div>
      </div>
    </div>

    <!-- ---------------------------------------------------- -->
    <!-- right side: page -->
    <!-- ---------------------------------------------------- -->
    <div class="col-span-5 my-auto h-full max-h-[600px] md:col-span-3 md:p-10">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}
.slide-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}
.slide-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
</style>
