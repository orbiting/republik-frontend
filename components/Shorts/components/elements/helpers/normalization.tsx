import { Transforms } from 'slate'
import {
  ChartBlockElement,
  CustomElement,
  FigureElement,
  NormalizeFn,
  QuoteElement
} from '../../custom-types'
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

// replace with insertBreak decorator
export const singleCaptionNode: NormalizeFn<
  FigureElement | QuoteElement | ChartBlockElement
> = ([node, path], editor) => {
  if (
    node.children.length > 2 &&
    (node.children[node.children.length - 1].type === 'figureCaption' ||
      node.children[node.children.length - 1].type === 'chartLegend') &&
    node.children[node.children.length - 2].type ===
      node.children[node.children.length - 1].type
  ) {
    Transforms.mergeNodes(editor, {
      at: path.concat(node.children.length - 1)
    })
  }
}
