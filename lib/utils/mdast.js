const splitChildren = (content, start, end) => {
  return {
    ...content,
    children: content.children.slice(start, end)
  }
}

export const splitByTitle = content => {
  const splitIndex =
    content.children.findIndex(node => node.identifier === 'TITLE') + 1
  return {
    title: splitIndex ? splitChildren(content, 0, splitIndex) : null,
    main: splitChildren(content, splitIndex)
  }
}
