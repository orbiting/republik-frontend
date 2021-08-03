import { Node, Path, Transforms } from 'slate'
import { ElementConfigI, FigureElement, NormalizeFn } from '../custom-types'
import { ContainerComponent } from '../editor/Element'

const deleteOrphanCaption: NormalizeFn<FigureElement> = (
  [node, path],
  editor
) => {
  if (node.children.length === 1) {
    Transforms.removeNodes(editor, { at: path })
  }
}

const splitCaptionOnEnter: NormalizeFn<FigureElement> = (
  [node, path],
  editor
) => {
  if (node.children.length === 3) {
    const newParagraphText = Node.string(node.children[2])
    const newParagraphPath = Path.next(path)
    Transforms.removeNodes(editor, { at: path.concat(2) })
    Transforms.insertNodes(
      editor,
      { type: 'paragraph', children: [{ text: newParagraphText }] },
      { at: newParagraphPath }
    )
    Transforms.select(editor, newParagraphPath)
    Transforms.collapse(editor)
  }
}

export const config: ElementConfigI = {
  Component: ContainerComponent,
  normalizations: [deleteOrphanCaption, splitCaptionOnEnter]
}
