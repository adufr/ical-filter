<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type { VEvent } from 'node-ical'
import type { Rule, RuleField, RuleType } from '~/types'
import { ruleFields, ruleTypes } from '~/types'

const toast = useToast()

const { activeCalendar, calendars } = useCalendars()

const isLoading = ref(false)
const domain = ref('')

const url = useLocalStorage('icalfilter.url', '')
const rules = useLocalStorage('icalfilter.rules', [] as Rule[])
const events = ref([] as VEvent[])

const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.set('url', url.value)

  const r = rules.value.map(rule => ({ f: rule.f, t: rule.t, cs: rule.cs, v: rule.v }))
  for (const rule of r)
    params.append('rules', JSON.stringify(rule))

  return params
})

const icalUrl = computed(() => `${domain.value}/api/ical?${queryParams.value}`)

const { copy: copyIcalUrl, isSupported: isClipboardSupported } = useClipboard({ source: icalUrl })

function copyToClipboard() {
  if (!isClipboardSupported.value) {
    useToast().add({ title: 'Clipboard not supported', color: 'error' })
    return
  }

  copyIcalUrl()
  useToast().add({ title: 'URL copied to clipboard!', color: 'success' })
}

const formState = reactive<Partial<FormSchema>>(activeCalendar.value)

function addRule() {
  formState.rules?.push({ f: 's', t: 'c', cs: true, v: '' })
}

function removeRule(index: number) {
  formState.rules?.splice(index, 1)
}

const ruleFieldsItems = computed<Array<{ label: string, value: RuleField }>>(() => Object.entries(ruleFields).map(([label, value]) => ({ label, value })))
const ruleTypesItems = computed<Array<{ label: string, value: RuleType }>>(() => Object.entries(ruleTypes).map(([label, value]) => ({ label, value })))
const ruleCsItems = computed<Array<{ label: string, value: boolean }>>(() => [{ label: 'case sensitive', value: true }, { label: 'case insensitive', value: false }])

async function fetchCalendar() {
  events.value = []
  isLoading.value = true
  try {
    const { events: fetchedEvents } = await $fetch(`/api/cal`, {
      query: {
        url: formState.url,
      },
    })

    events.value = fetchedEvents as unknown as VEvent[]
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  domain.value = window.location.origin

  if (formState.url) {
    fetchCalendar()
  }
})

async function submitForm(event: FormSubmitEvent<FormSchema>) {
  activeCalendar.value = event.data
  const existingCalendarIndex = calendars.value.findIndex(cal => cal.id === activeCalendar.value.id)
  if (existingCalendarIndex >= 0) {
    calendars.value[existingCalendarIndex] = activeCalendar.value
  }
  else {
    calendars.value.push(activeCalendar.value)
  }
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
}
</script>

<template>
  <UForm
    :schema="formSchema"
    :state="formState"
    class="size-full flex flex-col justify-between gap-5"
    @submit="submitForm"
  >
    <!-- inputs -->
    <div class="flex-grow flex flex-col gap-6 overflow-y-auto">
      <UFormField label="Calendar name" name="name">
        <UInput
          v-model="formState.name"
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
            v-model="formState.url"
            class="w-full"
            placeholder="Enter your iCalendar URL..."
            leading-icon="i-heroicons-link"
            @change="fetchCalendar()"
          />
        </UFormField>

        <!-- TODO: correctly implement this feature -->
        <!-- <p class="mt-1 text-sm text-gray-400">
          {{ formState.url
            ? isLoading
              ? 'Fetching events...'
              : `Found ${events.length} events `
            : 'Start by entering an iCalendar URL' }}
        </p> -->
      </div>

      <!-- rules -->
      <div class="space-y-1 h-full">
        <label class="block font-medium text-sm">Filtering rules</label>
        <!-- TODO: add a tooltip explaining the filtering rules -->

        <UForm
          v-for="(rule, index) in formState.rules"
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

    <!-- buttons -->
    <div class="flex items-center gap-2">
      <UButton type="submit" icon="i-heroicons-bookmark">
        Save calendar
      </UButton>

      <UButton
        color="primary"
        variant="soft"
        icon="i-heroicons-clipboard-document-list"
        @click="copyToClipboard()"
      >
        Copy calendar URL
      </UButton>
    </div>
  </UForm>
</template>
