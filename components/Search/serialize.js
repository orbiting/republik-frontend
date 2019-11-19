import { SUPPORTED_SORT } from './constants'

const KEY_VALUE_DELIMITER = ':'

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
