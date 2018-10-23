export const shouldIgnoreClick = event => {
  // source https://github.com/zeit/next.js/blob/82d56e063aad12ac8fee5b9d5ed24ccf725b1a5b/packages/next-server/lib/link.js#L59
  const { nodeName, target } = event.currentTarget
  if (nodeName === 'A' &&
    ((target && target !== '_self') || event.metaKey || event.ctrlKey || event.shiftKey || (event.nativeEvent && event.nativeEvent.which === 2))) {
    // ignore click for new tab / new window behavior
    return true
  }
}
