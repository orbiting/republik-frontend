import { formatLocale } from 'd3-format'
import { timeFormatLocale } from 'd3-time-format'
import timeDefinition from 'd3-time-format/locale/de-CH'

export const thousandSeparator = '\u2009'
export const swissNumbers = formatLocale({
  decimal: '.',
  thousands: thousandSeparator,
  grouping: [3],
  currency: ['CHF\u00a0', '']
})
const chf4Format = swissNumbers.format('$.0f')
const chf5Format = swissNumbers.format('$,.0f')
export const chfFormat = value => {
  if (String(Math.round(value)).length > 4) {
    return chf5Format(value)
  }
  return chf4Format(value)
}

const count4Format = swissNumbers.format('.0f')
const count5Format = swissNumbers.format(',.0f')
export const countFormat = value => {
  if (String(Math.round(value)).length > 4) {
    return count5Format(value)
  }
  return count4Format(value)
}

export const swissTime = timeFormatLocale(timeDefinition)
export const timeFormat = swissTime.format

const dateFormat = '%d.%m.%Y'
export const parseDate = swissTime.parse(dateFormat)
