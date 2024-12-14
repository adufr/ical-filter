<script setup lang="ts">
const props = defineProps<{
  mode: 'new' | 'edit'
}>()

const modal = useModal()
const { copyCalendarLink } = useCalendars()
</script>

<template>
  <UModal>
    <template #title>
      Calendar saved!
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="props.mode === 'edit'"
          color="warning"
          variant="soft"
          title="Warning"
          description="To apply changes when editing an existing calendar, you must re-import it into your calendar application."
          icon="i-heroicons-exclamation-triangle-20-solid"
        />

        <UAlert
          color="primary"
          variant="soft"
          title="What to do now?"
          description="Copy your calendar URL so you can import it in your favorite calendar application."
          :actions="[{
            label: 'Copy calendar URL',
            icon: 'i-heroicons-clipboard-document-list-16-solid',
            onClick: () => copyCalendarLink(),
          }]"
        />
      </div>
    </template>

    <template #footer>
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-left-16-solid"
        to="/list"
        @click="modal.close()"
      >
        Back to calendars list
      </UButton>
    </template>
  </UModal>
</template>
