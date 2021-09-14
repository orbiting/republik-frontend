// @ts-ignore
import { PullQuote } from '@project-r/styleguide'
import { ElementConfigI } from '../../custom-types'
import { quote } from '../../templates/quote'
import { matchTemplateElement } from '../helpers/normalization'

export const config: ElementConfigI = {
  Component: PullQuote,
  normalizations: [matchTemplateElement(quote)]
}
