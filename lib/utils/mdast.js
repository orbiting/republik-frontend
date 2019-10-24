const splitChildren = (content, start, end) => {
  return {
    ...content,
    children: content.children.slice(start, end)
  }
}

export const splitNodes = (content, nodeIdentifier) => {
  const splitIndex = content.children.findIndex((node) => node.identifier === nodeIdentifier) + 1
  return splitIndex
    ? [
      splitChildren(content, 0, splitIndex),
      splitChildren(content, splitIndex)
    ]
    : [content]
}
