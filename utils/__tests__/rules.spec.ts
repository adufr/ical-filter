import type { VEvent } from 'node-ical'
import type { Rule } from '~/types'
import { describe, expect, it } from 'vitest'
import { applyRuleFilter, applyRulesFilters } from '../rules'

const mockEvents: VEvent[] = [
  {
    type: 'VEVENT',
    summary: 'Team Meeting',
    description: 'Weekly sync',
    location: 'Room 101',
  },
  {
    type: 'VEVENT',
    summary: 'Lunch Break',
    description: 'Team lunch',
    location: 'Cafeteria',
  },
  {
    type: 'VEVENT',
    summary: 'Veterinary Appointment',
    description: 'Checkup',
    location: 'Veterinary Clinic',
  },
] as VEvent[]

describe('applyRuleFilter', () => {
  it('filters by summary contains', () => {
    const rule: Rule = { f: 's', t: 'c', v: 'Team' }
    const filtered = applyRuleFilter(mockEvents, rule)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].summary).toBe('Team Meeting')
  })

  it('filters by description equals', () => {
    const rule: Rule = { f: 'd', t: '=', v: 'Team lunch' }
    const filtered = applyRuleFilter(mockEvents, rule)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].summary).toBe('Lunch Break')
  })

  it('filters by location not equals', () => {
    const rule: Rule = { f: 'l', t: '!', v: 'Room 101' }
    const filtered = applyRuleFilter(mockEvents, rule)
    expect(filtered).toHaveLength(2)
    expect(filtered[0].location).toBe('Cafeteria')
    expect(filtered[1].location).toBe('Veterinary Clinic')
  })

  it('filters by summary starts-with', () => {
    const rule: Rule = { f: 's', t: 's', v: 'Team' }
    const filtered = applyRuleFilter(mockEvents, rule)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].summary).toBe('Team Meeting')
  })

  it('filters by location ends-with', () => {
    const rule: Rule = { f: 'l', t: 'e', v: '101' }
    const filtered = applyRuleFilter(mockEvents, rule)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].location).toBe('Room 101')
  })
})

describe('applyRulesFilters', () => {
  it('applies multiple rules (1)', () => {
    const rules: Rule[] = [
      { f: 's', t: 'c', v: 'Team Meeting' },
      { f: 'l', t: 'c', v: 'Cafeteria' },
    ]
    const filtered = applyRulesFilters(mockEvents, rules)
    expect(filtered).toHaveLength(2)
    expect(filtered[0].summary).toBe('Team Meeting')
    expect(filtered[1].location).toBe('Cafeteria')
  })

  it('applies multiple rules (2)', () => {
    const rules: Rule[] = [
      { f: 's', t: 'c', v: 'Team Meeting' },
      { f: 'l', t: 's', v: 'Veteri' },
    ]
    const filtered = applyRulesFilters(mockEvents, rules)
    expect(filtered).toHaveLength(2)
    expect(filtered[0].summary).toBe('Team Meeting')
    expect(filtered[1].location).toBe('Veterinary Clinic')
  })
})
