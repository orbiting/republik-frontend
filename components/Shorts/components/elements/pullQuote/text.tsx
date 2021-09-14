// @ts-ignore
import { PullQuoteText, inQuotes } from '@project-r/styleguide'
import {
  CustomText,
  ElementConfigI,
  NormalizeFn,
  PullQuoteTextElement
} from '../../custom-types'
import { Transforms, Element as SlateElement } from 'slate'

const setInQuotes: NormalizeFn<PullQuoteTextElement> = (
  [node, path],
  editor
) => {
  /*console.log('setInQuotes')
  const text = Node.string(node.children[0])
  console.log(text)
  const newProperties: Partial<CustomText> = { text: 'test' }
  console.log(newProperties) */
  if (!SlateElement.isElement(node)) return
  Transforms.removeNodes(editor, { at: path.concat(0) })
  Transforms.insertNodes(editor, { text: 'test' }, { at: path.concat(0) })
}

export const config: ElementConfigI = {
  Component: PullQuoteText,
  normalizations: [setInQuotes]
}
