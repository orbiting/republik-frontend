export const intersperse = (list, separator) => {
  if (list.length === 0) {
    return []
  }

  return list.slice(1).reduce((items, item, i) => {
    return items.concat([separator(item, i), item])
  }, [list[0]])
}

export const randomElement = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}

const splitNodesBefore = (content, titleIndex) => {
  return {
    ...content,
    children: content.children.slice(0, titleIndex + 1)
  }
}

const splitNodesAfter = (content, titleIndex) => {
  return {
    ...content,
    children: content.children.slice(titleIndex + 1)
  }
}

export const splitNodes = (content, splitNodeId) => {
  const titleIndex = content.children.findIndex((node) => node.identifier === splitNodeId)
  return titleIndex === -1
    ? [content]
    : [
      splitNodesBefore(content, titleIndex),
      splitNodesAfter(content, titleIndex)
    ]
}
