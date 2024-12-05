import type { Calendar } from '~/types'

export function useCalendars() {
  const calendars = useLocalStorage('calendars', [] as Calendar[])

  return {
    calendars,
  }
}
