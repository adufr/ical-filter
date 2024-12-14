import type { Calendar } from '~/types'

export function useCalendars() {
  const toast = useToast()

  const calendars = useLocalStorage('calendars', [] as Calendar[])

  const activeCalendar = useState('activeCalendar', () => ({
    id: '',
    name: '',
    url: '',
    rules: [],
  }) as Calendar)

  function copyCalendarLink(calendar: Calendar = activeCalendar.value) {
    const apiUrl = getCalendarUrl(calendar)
    const domain = window.location.origin

    navigator.clipboard.writeText(`${domain}${apiUrl}`)

    toast.add({
      title: 'Success',
      description: 'Calendar URL copied to your clipboard',
      color: 'success',
    })
  }

  return {
    calendars,
    activeCalendar,
    copyCalendarLink,
  }
}
