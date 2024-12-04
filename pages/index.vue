<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type { VEvent } from 'node-ical'
import type { Rule, RuleField, RuleType } from '~/types'
import { ruleFields, ruleTypes } from '~/types'

const toast = useToast()

const isLoading = ref(false)
const domain = ref('')

const EMPTY_RULE: Rule = { f: 's', t: 'c', cs: true, v: '' }

const url = useLocalStorage('icalfilter.url', '')
const rules = useLocalStorage('icalfilter.rules', [] as Rule[])
const events = ref([] as VEvent[])

onMounted(() => {
  domain.value = window.location.origin
})

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

async function fetchEvents() {
  isLoading.value = true
  try {
    // @ts-expect-error single endpoint for both json and ics
    const { events: fetchedEvents } = await $fetch(`/api/cal`, {
      query: {
        format: 'json',
        url: url.value,
        rules: [...rules.value.map(rule => ({ f: rule.f, t: rule.t, cs: rule.cs, v: rule.v }))],
      },
    })

    events.value = fetchedEvents as VEvent[]
  }
  finally {
    isLoading.value = false
  }
}

function copyToClipboard() {
  if (!isClipboardSupported.value) {
    useToast().add({ title: 'Clipboard not supported', color: 'error' })
    return
  }

  copyIcalUrl()
  useToast().add({ title: 'URL copied to clipboard!', color: 'success' })
}

const formState = reactive<Partial<FormSchema>>({
  url: url.value,
  name: undefined,
  rules: [EMPTY_RULE],
})

function addRule() {
  // TODO: if last rule value is empty, don't add another rule
  // if (formState.rules?.[formState.rules.length - 1]?.v === '')
  //   return

  formState.rules?.push({ f: 's', t: 'c', cs: true, v: '' })
}

function removeRule(index: number) {
  formState.rules?.splice(index, 1)
}

const ruleFieldsItems = computed<Array<{ label: string, value: RuleField }>>(() => Object.entries(ruleFields).map(([label, value]) => ({ label, value })))
const ruleTypesItems = computed<Array<{ label: string, value: RuleType }>>(() => Object.entries(ruleTypes).map(([label, value]) => ({ label, value })))
const ruleCsItems = computed<Array<{ label: string, value: boolean }>>(() => [{ label: 'case sensitive', value: true }, { label: 'case insensitive', value: false }])

async function submitForm(event: FormSubmitEvent<FormSchema>) {
  await fetchEvents()
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
}
</script>

<template>
  <div class="container w-2xl">
    <UForm
      :schema="formSchema"
      :state="formState"
      class="space-y-6"
      @submit="submitForm"
    >
      <UFormField label="Calendar name" name="name">
        <UInput
          v-model="formState.name"
          class="w-full"
          placeholder="Give your calendar a name..."
          leading-icon="i-heroicons-pencil-square"
        />
      </UFormField>

      <UFormField label="iCalendar URL" name="url">
        <UInput
          v-model="formState.url"
          class="w-full"
          placeholder="Enter your iCalendar URL..."
          leading-icon="i-heroicons-link"
        />
      </UFormField>

      <!-- rules -->
      <div class="space-y-1">
        <div class="flex items-end justify-between w-full">
          <label class="block font-medium text-sm">Filtering rules</label>
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
              <UButton leading-icon="i-heroicons-trash" @click="removeRule(index)" />
            </UFormField>
          </UButtonGroup>
        </UForm>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-clipboard-document-list"
          @click="copyToClipboard()"
        >
          Copy calendar URL
        </UButton>

        <UButton
          type="submit"
          icon="i-heroicons-arrow-path"
          variant="soft"
          color="neutral"
          :loading="isLoading"
        >
          Fetch events
        </UButton>

        <p class="text-sm">
          Found {{ events.length }} events
        </p>
      </div>
    </UForm>
  </div>
</template>
