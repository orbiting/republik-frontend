import { QuoteElement } from '../custom-types'
import { caption as captionTemplate } from './figure'

export const quote: QuoteElement = {
  type: 'quote',
  children: [
    {
      type: 'quoteParagraph',
      children: [{ text: 'Zitat' }]
    },
    captionTemplate
  ]
}
