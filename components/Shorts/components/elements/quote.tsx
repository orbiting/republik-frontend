// @ts-ignore
import { BlockQuote } from '@project-r/styleguide'
import { ElementConfigI, NormalizeFn, QuoteElement } from '../custom-types'
import { quote } from '../templates/quote'
import { Transforms } from 'slate'

// TODO: this behaviour at least one repeat (e.g. for quote paragraphs here
// should be abstracted and merged to the generic matchTemplateElement
// helper function
// see prose mirror for a descriptive schema example
export const quoteStructure: NormalizeFn<QuoteElement> = (
  [node, path],
  editor
) => {
  if (node.children[0].type !== 'quoteParagraph') {
    Transforms.insertNodes(editor, quote.children[0], {
      at: path.concat(0)
    })
  }
  if (node.children[node.children.length - 1].type !== 'figureCaption') {
    Transforms.insertNodes(editor, quote.children[1], {
      at: path.concat(node.children.length)
    })
  }
}

export const config: ElementConfigI = {
  Component: BlockQuote,
  normalizations: [quoteStructure]
}
