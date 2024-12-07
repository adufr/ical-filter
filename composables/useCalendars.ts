import type { Calendar } from '~/types'

export function useCalendars() {
  const calendars = useLocalStorage('calendars', [] as Calendar[])
  const activeCalendar = useState('activeCalendar', () => ({
    id: '',
    name: '',
    url: '',
    rules: [],
  }) as Calendar)

  return {
    calendars,
    activeCalendar,
  }
}
