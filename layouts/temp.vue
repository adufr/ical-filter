<script lang="ts" setup>
const toast = useToast();

function startTour() {
  toast.add({
    title: "Not implemented yet!",
    description: "This feature will be available soon.",
    color: "warning",
  });
}
</script>

<template>
  <div class="h-screen w-screen p-4 grid grid-cols-5 gap-4">
    <!-- ---------------------------------------------------- -->
    <!-- left side: menu -->
    <!-- ---------------------------------------------------- -->
    <div
      class="col-span-5 md:col-span-2 p-4 md:p-14 bg-primary-700 rounded-xl text-white"
    >
      <div class="h-full flex flex-col justify-between gap-4">
        <div class="flex items-center justify-between gap-2">
          <h1 class="text-lg md:text-2xl font-bold">iCalFilter</h1>

          <ColorModeButton />
        </div>

        <div class="flex text-center md:text-left flex-col gap-5">
          <p class="text-xl md:text-4xl font-bold">
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
          class="p-2 flex items-center justify-center gap-2 bg-primary-800 rounded-xl"
        >
          <AppFooter class="" />
        </div>
      </div>
    </div>

    <!-- ---------------------------------------------------- -->
    <!-- right side: page -->
    <!-- ---------------------------------------------------- -->
    <div class="col-span-5 md:col-span-3 my-auto max-h-[600px] h-full md:p-10">
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
