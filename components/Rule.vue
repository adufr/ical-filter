<script lang="ts" setup>
import { type Rule, ruleActions, ruleFields, ruleTypes } from '~/types'

defineEmits<{
  (e: 'remove'): void
}>()

const rule = defineModel<Rule>({ required: true })
</script>

<template>
  <div class="grid grid-cols-5">
    <USelect v-model="rule.field" :items="Object.keys(ruleFields)" />
    <USelect v-model="rule.type" :items="Object.keys(ruleTypes)" />
    <UInput v-model="rule.value" />
    <USelect v-model="rule.action" :items="Object.keys(ruleActions)" />
    <UButton leading-icon="i-heroicons-trash" @click="$emit('remove')" />
  </div>
</template>
