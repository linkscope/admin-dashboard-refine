import dayjs from 'dayjs'

type colors = 'default' | 'warning' | 'error' | 'processing'

const getDateColor = (date: string, defaultColor?: colors) => {
  const day = dayjs(date)
  const today = dayjs()

  if (day.isBefore(today)) {
    return 'error'
  }

  if (day.isBefore(today.add(3, 'day'))) {
    return 'warning'
  }

  return defaultColor ?? 'default'
}

export default getDateColor
