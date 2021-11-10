import { CustomEditor, CustomNode, ElementConfigI } from '../../../custom-types'
import { BasePoint, Editor, Element as SlateElement, Node } from 'slate'
import { config as elConfig } from '../../elements'

export const getElConfig = (node: CustomNode): ElementConfigI | undefined => {
  const currentType = SlateElement.isElement(node) && node.type
  if (!currentType) return
  return elConfig[currentType]
}

export const testSomeChildEl = (
  test: (node: CustomNode) => boolean,
  editor: CustomEditor,
  path?: BasePoint
): boolean => {
  if (!path) return false
  for (const [node] of Node.ancestors(editor, Editor.path(editor, path))) {
    if (test(node)) {
      return true
    }
  }
  return false
}
