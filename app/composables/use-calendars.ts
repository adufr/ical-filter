export function useCalendars() {
  const toast = useToast()

  const calendars = useLocalStorage('calendars', [] as Calendar[])

  const activeCalendar = useState<Calendar>('activeCalendar', () => {
    const defaultCalendar: Calendar = {
      id: '',
      name: '',
      url: '',
      rules: [],
      replacements: [],
    }
    return defaultCalendar
  })

  function copyCalendarLink(calendar: Calendar = activeCalendar.value) {
    const apiUrl = getCalendarUrl(calendar)
    const domain = globalThis.location.origin

    // eslint-disable-next-line baseline-js/use-baseline
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
