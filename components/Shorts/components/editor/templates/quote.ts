import { PullQuoteElement } from '../../custom-types'

export const quote: PullQuoteElement = {
  type: 'pullQuote',
  children: [
    {
      type: 'pullQuoteText',
      children: [{ text: 'Zitat' }]
    },
    {
      type: 'pullQuoteSource',
      children: [{ text: 'Quelle' }]
    }
  ]
}
