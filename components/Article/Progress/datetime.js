import { timeFormat, swissTime } from '../../../lib/utils/format'

const MS_PER_DAY = 60 * 60 * 24 * 1000

const getLastMidnight = () => {
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  return today
}

export default (t, date, lastMidnight = getLastMidnight()) => {
  const diff = date - lastMidnight

  const formatDate = swissTime.format('%d.%m.%Y')
  const formatTime = timeFormat('%H:%M')

  const displayDay = diff > 0
    ? t('article/progress/time/today')
    : diff > -MS_PER_DAY
      ? t('article/progress/time/yesterday')
      : t('article/progress/time/other', { date: formatDate(date) })
  const displayTime = formatTime(date)

  return t('article/progress/time', {
    day: displayDay,
    time: displayTime
  })
}
