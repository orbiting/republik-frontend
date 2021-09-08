import { FigureCaptionElement, FigureElement } from '../custom-types'
import { emptyText } from './text'

export const caption: FigureCaptionElement = {
  type: 'figureCaption',
  children: [{ text: 'Legende' }]
}

export const figure = (): FigureElement => ({
  type: 'figure',
  children: [
    { type: 'figureImage', src: '', children: [emptyText] },
    {
      type: 'figureCaption',
      children: [
        {
          text: 'Legende'
        }
      ]
    }
  ]
})
