import { SUPPORTED_FILTER, SUPPORTED_SORT } from './constants'

const KEY_VALUE_DELIMITER = ':'
const LIST_ITEM_DELIMITER = '|'

const isSupportedFilter = filter => {
  return (
    !!SUPPORTED_FILTER[filter.key] &&
    SUPPORTED_FILTER[filter.key].indexOf(filter.value) !== -1
  )
}

export const deserializeFilters = filtersString => {
  return decodeURIComponent(filtersString)
    .split(LIST_ITEM_DELIMITER)
    .map(f => f.split(KEY_VALUE_DELIMITER))
    .filter(f => f.length === 2)
    .map(([key, value]) => ({ key, value }))
    .filter(f => isSupportedFilter(f))
}

export const serializeFilters = filtersObject => {
  return filtersObject
    .filter(filter => isSupportedFilter(filter))
    .map(
      filter =>
        filter.key + encodeURIComponent(KEY_VALUE_DELIMITER) + filter.value
    )
    .join(encodeURIComponent(LIST_ITEM_DELIMITER))
}

export const deserializeSort = sortString => {
  const sortArray = decodeURIComponent(sortString).split(KEY_VALUE_DELIMITER)
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
  return key + encodeURIComponent(KEY_VALUE_DELIMITER) + (direction || '')
}
