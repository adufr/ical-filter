import type { VEvent } from 'node-ical'
import type { Rule } from '~/types'

export function applyRulesFilters(icsEvents: VEvent[], rules: Rule[]) {
  return icsEvents.filter((event) => {
    for (const rule of rules) {
      const include = rule.a === 'i' // i ->  include | e -> exclude

      let fieldValue: string

      switch (rule.f) {
        case 's':
          fieldValue = event.summary
          break
        case 'd':
          fieldValue = event.description
          break
        case 'l':
          fieldValue = event.location
          break
      }

      switch (rule.t) {
        case 'c':
          if (fieldValue?.includes(rule.v))
            return include
          break
        case '=':
          if (fieldValue !== rule.v)
            return include
          break
        case '!':
          if (fieldValue === rule.v)
            return include
          break
        case 's':
          if (!fieldValue?.startsWith(rule.v))
            return include
          break
        case 'e':
          if (!fieldValue?.endsWith(rule.v))
            return include
          break
      }
    }

    return false
  })
}
