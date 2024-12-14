<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type { VEvent } from 'node-ical'
import type { RuleField, RuleType } from '~/types'
import { ruleFields, ruleTypes } from '~/types'

const props = defineProps<{
  mode: 'new' | 'edit'
}>()

const toast = useToast()
const router = useRouter()
const { activeCalendar, calendars } = useCalendars()

const formParams = computed(() => ({ url: activeCalendar.value.url }))

const { data, status, error } = useLazyFetch('/api/cal', {
  params: formParams,
  immediate: Boolean(activeCalendar.value.url),
})

const filteredRules = computed(() => (activeCalendar.value.rules ?? []).filter(rule => rule.v))
const filteredEvents = computed(() => applyRulesFilters((data.value?.events ?? []) as unknown as VEvent[], filteredRules.value))

// --------------------------------------------------------------------------
// Rules

const ruleFieldsItems = computed<Array<{ label: string, value: RuleField }>>(
  () => Object.entries(ruleFields).map(([label, value]) => ({ label, value })),
)
const ruleTypesItems = computed<Array<{ label: string, value: RuleType }>>(
  () => Object.entries(ruleTypes).map(([label, value]) => ({ label, value })),
)
const ruleCsItems = computed<Array<{ label: string, value: boolean }>>(
  () => [{ label: 'case sensitive', value: true }, { label: 'case insensitive', value: false }],
)

function addRule() {
  activeCalendar.value.rules?.push({ f: 's', t: 'c', cs: true, v: '' })
}

function removeRule(index: number) {
  activeCalendar.value.rules?.splice(index, 1)
}

// --------------------------------------------------------------------------
// Actions

async function saveCalendar(event: FormSubmitEvent<FormSchema>) {
  if (props.mode === 'new') {
    calendars.value.push({
      id: crypto.randomUUID(),
      ...event.data,
    })
  }
  else if (props.mode === 'edit') {
    const existingCalendarIndex = calendars.value.findIndex(cal => cal.id === activeCalendar.value.id)
    if (existingCalendarIndex !== -1) {
      calendars.value[existingCalendarIndex] = event.data
    }
  }

  toast.add({
    title: 'Success',
    description: 'Your calendar has been saved',
    color: 'success',
  })
}

function deleteCalendar() {
  calendars.value = calendars.value.filter(cal => cal.id !== activeCalendar.value.id)

  // TODO: add an undo button
  toast.add({
    title: 'Success',
    description: 'The calendar has been deleted',
    color: 'success',
  })

  router.push('/list')
}

function copyCalendarLink() {
  const apiUrl = getCalendarUrl(activeCalendar.value)
  const domain = window.location.origin

  navigator.clipboard.writeText(`${domain}${apiUrl}`)

  toast.add({
    title: 'Success',
    description: 'Calendar URL copied to your clipboard',
    color: 'success',
  })
}
</script>

<template>
  <UForm
    :schema="formSchema"
    :state="activeCalendar"
    class="size-full flex flex-col justify-between gap-5"
    @submit="saveCalendar"
  >
    <!-- inputs -->
    <div class="flex flex-col gap-6">
      <UFormField label="Calendar name" name="name">
        <UInput
          v-model="activeCalendar.name"
          class="w-full"
          placeholder="Give your calendar a name..."
          leading-icon="i-heroicons-pencil-square"
        />
      </UFormField>

      <div>
        <UFormField
          label="iCalendar URL"
          name="url"
        >
          <UInput
            v-model="activeCalendar.url"
            class="w-full"
            placeholder="Enter your iCalendar URL..."
            leading-icon="i-heroicons-link"
          />
        </UFormField>

        <div class="mt-1 text-sm text-gray-400">
          <p v-if="!activeCalendar.url">
            Enter an iCalendar URL
          </p>

          <div v-else-if="status === 'pending'" class="flex items-center gap-1">
            <UIcon name="i-svg-spinners-270-ring-with-bg" />
            <p>Fetching events...</p>
          </div>
          <p v-else-if="error" class="text-red-500 dark:text-red-400">
            An error has occured: make sure the URL is a valid iCalendar URL
          </p>
          <p v-else>
            Found a total of {{ data?.events.length }} events
          </p>
        </div>
      </div>

      <!-- rules -->
      <div class="h-full">
        <label class="block mb-1 font-medium text-sm">Filtering rules</label>
        <!-- TODO: add a tooltip explaining the filtering rules -->

        <UForm
          v-for="(rule, index) in activeCalendar.rules"
          :key="index"
          :state="rule"
          :schema="ruleSchema"
        >
          <UButtonGroup class="w-full space-y-1">
            <UFormField name="f">
              <USelect
                v-model="rule.f"
                :items="ruleFieldsItems"
                class="max-w-32 w-full"
              />
            </UFormField>

            <UFormField name="t">
              <USelect
                v-model="rule.t"
                :items="ruleTypesItems"
                class="max-w-32 w-full"
              />
            </UFormField>

            <UFormField name="cs">
              <USelect
                v-model="rule.cs"
                :items="ruleCsItems"
                class="max-w-40 w-full"
              />
            </UFormField>

            <UFormField name="v" class="w-full">
              <UInput
                v-model="rule.v"
                class="w-full"
                placeholder="Enter some text..."
              />
            </UFormField>

            <UFormField>
              <UButton
                variant="soft"
                icon="i-heroicons-trash"
                @click="removeRule(index)"
              />
            </UFormField>
          </UButtonGroup>
        </UForm>

        <div class="flex items-center  gap-2">
          <p v-if="activeCalendar.rules?.length > 0" class="text-sm text-gray-400">
            Found {{ filteredEvents.length }} events matching rules
          </p>

          <UButton
            size="sm"
            variant="ghost"
            color="neutral"
            icon="i-heroicons-plus"
            @click="addRule()"
          >
            Add rule
          </UButton>
        </div>
      </div>
    </div>

    <!-- buttons -->
    <div class="flex items-center gap-2">
      <UButton type="submit" icon="i-heroicons-bookmark">
        Save calendar
      </UButton>

      <UButton
        variant="soft"
        icon="i-heroicons-link"
        @click="copyCalendarLink()"
      >
        Copy calendar link
      </UButton>

      <UButton
        variant="ghost"
        icon="i-heroicons-trash"
        @click="deleteCalendar()"
      >
        Delete calendar
      </UButton>
    </div>
  </UForm>
</template>
