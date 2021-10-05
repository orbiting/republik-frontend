// @ts-ignore
import { FigureCaption } from '@project-r/styleguide'
import { ElementConfigI } from '../../../custom-types'

export const config: ElementConfigI = {
  Component: FigureCaption,
  structure: [{ type: ['text', 'link'] }, { type: 'figureByline' }],
  attrs: {
    formatText: true,
    disableBreaks: true
  }
}
