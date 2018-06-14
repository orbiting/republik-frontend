import { SUPPORTED_FILTER, SUPPORTED_SORT } from './constants'

const isSupportedFilter = filter => {
  return (
    !!SUPPORTED_FILTER[filter.key] &&
    SUPPORTED_FILTER[filter.key].indexOf(filter.value) !== -1
  )
}

export const deserializeFilters = filtersString => {
  return decodeURIComponent(filtersString)
    .split('|')
    .filter(filter => filter.split(':').length === 2)
    .map(filter => ({ key: filter.split(':')[0], value: filter.split(':')[1] }))
    .filter(filter => isSupportedFilter(filter))
}

export const serializeFilters = filtersObject => {
  return filtersObject
    .filter(filter => isSupportedFilter(filter))
    .map(filter => filter.key + encodeURIComponent(':') + filter.value)
    .join(encodeURIComponent('|'))
}

export const deserializeSort = sortString => {
  const sortArray = decodeURIComponent(sortString).split(':')
  if (!SUPPORTED_SORT[sortArray[0]]) return

  let sort = {
    key: sortArray[0]
  }
  if (
    sortArray.length > 1 &&
    SUPPORTED_SORT[sortArray[0]].indexOf(sortArray[1]) !== -1
  ) {
    sort.direction = sortArray[1]
  }
  return sort
}

export const serializeSort = sortObject => {
  const { key, direction } = sortObject
  if (!SUPPORTED_SORT[key]) return
  return key + encodeURIComponent(':') + (direction || '')
}
