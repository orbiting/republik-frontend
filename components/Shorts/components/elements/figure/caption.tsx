// @ts-ignore
import { FigureCaption } from '@project-r/styleguide'
import { ElementConfigI } from '../../../custom-types'

export const config: ElementConfigI = {
  Component: FigureCaption,
  structure: [
    { type: ['text', 'link'], repeat: true },
    { type: 'figureByline' },
    { type: 'text', bookend: true }
  ],
  attrs: {
    formatText: true
  }
}
