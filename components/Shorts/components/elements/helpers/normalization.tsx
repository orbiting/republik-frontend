import { Transforms } from 'slate'
import { CustomElement, NormalizeFn } from '../../custom-types'
import { Element as SlateElement } from 'slate'

export const matchTemplateElement: (
  e: CustomElement
) => NormalizeFn<CustomElement> = templateElement => ([node, path], editor) => {
  if (!SlateElement.isElement(node)) return
  templateElement.children.some((templateChildElement, i) => {
    if (
      node.children.length <= i ||
      (SlateElement.isElement(node.children[i]) &&
        SlateElement.isElement(templateChildElement) &&
        // @ts-ignore
        node.children[i].type !== templateChildElement.type)
    ) {
      Transforms.insertNodes(editor, templateChildElement, {
        at: path.concat(i)
      })
      return true
    }
  })
}
