export const hasAncestor = (node, predicate) => {
  if (predicate(node)) {
    return true
  }
  if (node.parentNode) {
    return hasAncestor(node.parentNode, predicate)
  }
  return false
}
