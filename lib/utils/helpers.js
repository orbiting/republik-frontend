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

export const getElementFromSeed = (list, seed, maxSeed) =>
  list[Math.round((seed * (list.length - 1)) / maxSeed)]
