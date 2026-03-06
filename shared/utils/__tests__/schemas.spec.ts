import { describe, expect, it } from 'vitest'

import { formSchema } from '../schemas'

describe('formSchema', () => {
  it('normalizes a blank timezone to undefined', () => {
    const result = formSchema.parse({
      name: 'Filtered calendar',
      url: 'https://example.com/calendar.ics',
      timezone: '   ',
      rules: [],
      replacements: [],
    })

    expect(result.timezone).toBeUndefined()
  })

  it('rejects invalid manual timezones', () => {
    const result = formSchema.safeParse({
      name: 'Filtered calendar',
      url: 'https://example.com/calendar.ics',
      timezone: 'Mars/OlympusMons',
      rules: [],
      replacements: [],
    })

    expect(result.success).toBe(false)
  })
})
