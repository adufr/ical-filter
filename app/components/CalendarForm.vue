<script lang="ts" setup>
import CalendarPreviewModal from './CalendarPreviewModal.vue'
import NewCalendarModal from './NewCalendarModal.vue'

import type { FormSubmitEvent } from '@nuxt/ui'
import type { VEvent } from 'node-ical'

const props = defineProps<{
  mode: 'new' | 'edit'
}>()

const toast = useToast()
const overlay = useOverlay()
const router = useRouter()
const { activeCalendar, calendars, copyCalendarLink } = useCalendars()

const newCalendarModal = overlay.create(NewCalendarModal)
const calendarPreviewModal = overlay.create(CalendarPreviewModal)
const formParams = computed(() => ({ url: activeCalendar.value.url }))

const { data, status, error, refresh } = useLazyFetch('/api/cal', {
  params: formParams,
  immediate: Boolean(activeCalendar.value.url),
})

const filteredRules = computed(() =>
  (activeCalendar.value.rules ?? []).filter((rule) => rule.v),
)
const filteredReplaceRules = computed(() =>
  (activeCalendar.value.replacements ?? []).filter(
    (replacement) => replacement.from,
  ),
)
const parsedEvents = computed(
  () => (data.value?.events ?? []) as unknown as VEvent[],
)
const eventsMatchingFilters = computed(() =>
  filteredRules.value.length > 0
    ? applyRulesFilters(parsedEvents.value, filteredRules.value)
    : parsedEvents.value,
)
const previewEvents = computed(() =>
  applyReplaceRules(eventsMatchingFilters.value, filteredReplaceRules.value),
)

// --------------------------------------------------------------------------
// Init new calendar

if (props.mode === 'new') {
  activeCalendar.value = {
    id: crypto.randomUUID(),
    name: '',
    url: '',
    rules: [],
    replacements: [],
  }
}

if (!activeCalendar.value.rules) {
  activeCalendar.value.rules = []
}
if (!activeCalendar.value.replacements) {
  activeCalendar.value.replacements = []
}

// --------------------------------------------------------------------------
// Rules

const ruleFieldsItems = computed<Array<{ label: string; value: RuleField }>>(
  () => Object.entries(ruleFields).map(([label, value]) => ({ label, value })),
)
const ruleTypesItems = computed<Array<{ label: string; value: RuleType }>>(() =>
  Object.entries(ruleTypes).map(([label, value]) => ({ label, value })),
)
const ruleCsItems = computed<Array<{ label: string; value: boolean }>>(() => [
  { label: 'case sensitive', value: true },
  { label: 'case insensitive', value: false },
])

function addRule() {
  activeCalendar.value.rules?.push({ f: 's', t: 'c', cs: true, v: '' })
}

function removeRule(index: number) {
  activeCalendar.value.rules?.splice(index, 1)
}

function addReplaceRule() {
  activeCalendar.value.replacements?.push({
    f: 's',
    cs: true,
    from: '',
    to: '',
  })
}

function removeReplaceRule(index: number) {
  activeCalendar.value.replacements?.splice(index, 1)
}

// --------------------------------------------------------------------------
// Actions

async function saveCalendar(event: FormSubmitEvent<FormSchema>) {
  const newCalendar = {
    id: activeCalendar.value.id,
    ...event.data,
  }

  if (props.mode === 'new') {
    calendars.value.push(newCalendar)
    await nextTick() // otherwise calendar doesn't have time to get stored
    router.push(`/edit/${newCalendar.id}`)
  } else if (props.mode === 'edit') {
    const existingCalendarIndex = calendars.value.findIndex(
      (cal) => cal.id === activeCalendar.value.id,
    )
    if (existingCalendarIndex !== -1) {
      calendars.value[existingCalendarIndex] = newCalendar
    }
  }

  newCalendarModal.open({ mode: props.mode })
}

function deleteCalendar() {
  calendars.value = calendars.value.filter(
    (cal) => cal.id !== activeCalendar.value.id,
  )

  // TODO: add an undo button
  toast.add({
    title: 'Success',
    description: 'The calendar has been deleted',
    color: 'success',
  })

  router.push('/calendars')
}
</script>

<template>
  <UForm
    :schema="formSchema"
    :state="activeCalendar"
    class="flex size-full flex-col justify-between gap-5"
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
        <UFormField label="iCalendar URL" name="url">
          <UInput
            v-model="activeCalendar.url"
            class="w-full"
            placeholder="Enter your iCalendar URL..."
            leading-icon="i-heroicons-link"
            @change="refresh()"
          />
        </UFormField>

        <div class="mt-1 text-sm text-gray-400">
          <p v-if="!activeCalendar.url">Enter an iCalendar URL</p>

          <div v-else-if="status === 'pending'" class="flex items-center gap-1">
            <UIcon name="i-svg-spinners-270-ring-with-bg" />
            <p>Fetching events...</p>
          </div>
          <p v-else-if="error" class="text-red-500 dark:text-red-400">
            An error has occured: make sure the URL is a valid iCalendar URL
          </p>
          <p v-else>Found a total of {{ data?.events.length ?? 0 }} events</p>
        </div>
      </div>

      <!-- rules -->
      <div class="flex h-full flex-col gap-4">
        <div>
          <label class="mb-1 block text-sm font-medium">Filtering rules</label>
          <!-- TODO: add a tooltip explaining the filtering rules -->

          <UForm
            v-for="(rule, index) in activeCalendar.rules"
            :key="index"
            :state="rule"
            :schema="ruleSchema"
          >
            <UButtonGroup>
              <UFormField name="f">
                <USelect
                  v-model="rule.f"
                  :items="ruleFieldsItems"
                  class="w-full max-w-32 rounded-r-none"
                />
              </UFormField>

              <UFormField name="t">
                <USelect
                  v-model="rule.t"
                  :items="ruleTypesItems"
                  class="w-full max-w-32 rounded-none"
                />
              </UFormField>

              <UFormField name="cs">
                <USelect
                  v-model="rule.cs"
                  :items="ruleCsItems"
                  class="w-full max-w-40 rounded-none"
                />
              </UFormField>

              <UFormField name="v" class="w-full">
                <UInput
                  v-model="rule.v"
                  class="w-full rounded-l-none rounded-r-none"
                  :placeholder="
                    rule.t === ruleTypes.regex
                      ? 'Enter regex... e.g. /team/i'
                      : 'Enter some text...'
                  "
                  :ui="{
                    base: 'rounded-l-none rounded-r-none',
                  }"
                />
              </UFormField>

              <UFormField>
                <UButton
                  variant="soft"
                  icon="i-heroicons-trash"
                  class="rounded-l-none"
                  @click="removeRule(index)"
                />
              </UFormField>
            </UButtonGroup>
          </UForm>

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

        <div>
          <label class="mb-1 block text-sm font-medium"
            >Replacement rules</label
          >

          <UForm
            v-for="(replaceRule, index) in activeCalendar.replacements"
            :key="`replace-${index}`"
            :state="replaceRule"
            :schema="replaceRuleSchema"
          >
            <UButtonGroup>
              <UFormField name="f">
                <USelect
                  v-model="replaceRule.f"
                  :items="ruleFieldsItems"
                  class="w-full max-w-32 rounded-r-none"
                />
              </UFormField>

              <UFormField name="cs">
                <USelect
                  v-model="replaceRule.cs"
                  :items="ruleCsItems"
                  class="w-full max-w-40 rounded-none"
                />
              </UFormField>

              <UFormField name="from" class="w-full">
                <UInput
                  v-model="replaceRule.from"
                  class="w-full rounded-l-none rounded-r-none"
                  placeholder="Replace this... or /regex/flags"
                  :ui="{
                    base: 'rounded-l-none rounded-r-none',
                  }"
                />
              </UFormField>

              <UFormField name="to" class="w-full">
                <UInput
                  v-model="replaceRule.to"
                  class="w-full rounded-l-none rounded-r-none"
                  placeholder="With this..."
                  :ui="{
                    base: 'rounded-l-none rounded-r-none',
                  }"
                />
              </UFormField>

              <UFormField>
                <UButton
                  variant="soft"
                  icon="i-heroicons-trash"
                  class="rounded-l-none"
                  @click="removeReplaceRule(index)"
                />
              </UFormField>
            </UButtonGroup>
          </UForm>

          <UButton
            size="sm"
            variant="ghost"
            color="neutral"
            icon="i-heroicons-plus"
            @click="addReplaceRule()"
          >
            Add replace
          </UButton>
        </div>

        <div class="flex items-center gap-2">
          <div
            v-if="
              (activeCalendar.rules?.length ?? 0) > 0 ||
              (activeCalendar.replacements?.length ?? 0) > 0
            "
            class="flex items-center gap-2"
          >
            <p class="text-sm text-gray-400">
              Found {{ previewEvents.length }} events in preview
            </p>

            <UTooltip text="Show a preview of the calendar">
              <UButton
                size="sm"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-question-mark-circle"
                @click="calendarPreviewModal.open({ events: previewEvents })"
              />
            </UTooltip>
          </div>
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
