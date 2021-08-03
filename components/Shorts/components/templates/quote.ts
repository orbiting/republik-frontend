import { QuoteElement } from '../custom-types'
import { caption as captionTemplate } from './figure'

export const quote: QuoteElement = {
  type: 'quote',
  children: [
    {
      type: 'quoteParagraph',
      children: [{ text: "Quoting someone doesn't make them right." }]
    },
    {
      type: 'quoteParagraph',
      children: [{ text: 'Or does it?' }]
    },
    captionTemplate
  ]
}
