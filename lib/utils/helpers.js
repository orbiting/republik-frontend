export const intersperse = (list, separator) => {
  if (list.length === 0) {
    return []
  }

  return list.slice(1).reduce(
    (items, item, i) => {
      return items.concat([separator(item, i), item])
    },
    [list[0]]
  )
}

export const getRandomInt = limit => Math.floor(Math.random() * limit)

export const normalise = (value, oldMax, newMax) => (value * newMax) / oldMax

export const getElementFromSeed = (list, seed, seedLimit) =>
  list?.length
    ? list[Math.round(normalise(seed, seedLimit - 1, list.length - 1))]
    : undefined

export const cleanAsPath = asPath => asPath.split('?')[0].split('#')[0]
