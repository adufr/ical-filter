<script lang="ts" setup>
import type { VEvent } from 'node-ical'
import type { Rule } from '~/types'

const isLoading = ref(false)
const domain = ref('')

const url = useLocalStorage('icalfilter.url', '')
const rules = useLocalStorage('icalfilter.rules', [] as Rule[])
const events = ref([] as VEvent[])

onMounted(() => {
  domain.value = window.location.origin
})

function addRule() {
  rules.value.push({ f: 's', t: 'c', a: 'i', v: '' })
}

function removeRule(index: number) {
  rules.value.splice(index, 1)
}

const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.set('url', url.value)

  const r = rules.value.map(rule => ({ f: rule.f, t: rule.t, a: rule.a, v: rule.v }))
  for (const rule of r)
    params.append('rules', JSON.stringify(rule))

  return params
})

const icalUrl = computed(() => `${domain.value}/api/ical?${queryParams.value}`)

const { copy: copyIcalUrl, isSupported: isClipboardSupported } = useClipboard({ source: icalUrl })

async function generateAndCopyLink() {
  if (!isClipboardSupported.value) {
    useToast().add({ title: 'Clipboard not supported', color: 'info' })
    return
  }

  isLoading.value = true
  try {
    // @ts-expect-error single endpoint for both json and ics
    const { events: fetchedEvents } = await $fetch(`/api/cal`, {
      query: {
        format: 'json',
        url: url.value,
        rules: [...rules.value.map(rule => ({ f: rule.f, t: rule.t, a: rule.a, v: rule.v }))],
      },
    })

    events.value = fetchedEvents as VEvent[]

    copyIcalUrl()
    useToast().add({ title: 'URL copied to clipboard', color: 'success' })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container w-xl flex flex-col gap-10">
    <!-- set url and fetch events -->
    <div class="flex flex-col gap-2">
      <p>Enter URL:</p>

      <UInput v-model="url" type="url" />
    </div>

    <!-- edit rules -->
    <div class="w-full flex flex-col gap-2">
      <p>Edit rules:</p>

      <div class="w-full flex flex-col gap-2">
        <Rule
          v-for="(rule, index) in rules"
          :key="index"
          v-model="rules[index]"
          class="w-full"
          @remove="removeRule(index)"
        />
      </div>

      <div>
        <UButton @click="addRule()">
          Add rule
        </UButton>
      </div>
    </div>

    <!-- get calendar url -->
    <div class="flex flex-col gap-2">
      <div>
        <UButton :loading="isLoading" leading-icon="i-heroicons-clipboard-document-list" @click="generateAndCopyLink()">
          Copy calendar URL
        </UButton>
      </div>

      <p>Found {{ events.length }} events</p>
    </div>
  </div>
</template>
