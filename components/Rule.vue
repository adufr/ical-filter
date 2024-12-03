<script lang="ts" setup>
import { type Rule, type RuleField, ruleFields, type RuleType, ruleTypes } from '~/types'

defineEmits<{
  (e: 'remove'): void
}>()

const rule = defineModel<Rule>({ required: true })

const ruleFieldsItems = computed<Array<{ label: string, value: RuleField }>>(() => Object.entries(ruleFields).map(([label, value]) => ({ label, value })))
const ruleTypesItems = computed<Array<{ label: string, value: RuleType }>>(() => Object.entries(ruleTypes).map(([label, value]) => ({ label, value })))
</script>

<template>
  <UButtonGroup>
    <USelect v-model="rule.f" :items="ruleFieldsItems" class="max-w-32 w-full" />
    <USelect v-model="rule.t" :items="ruleTypesItems" class="max-w-32 w-full" />
    <UInput v-model="rule.v" class="w-full" />
    <UButton leading-icon="i-heroicons-trash" @click="$emit('remove')" />
  </UButtonGroup>
</template>
