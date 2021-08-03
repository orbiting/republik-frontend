import {
  FigureBylineElement,
  FigureCaptionElement,
  FigureElement
} from '../custom-types'
import { emptyText } from './text'

export const byline: FigureBylineElement = {
  type: 'figureByline',
  children: [{ text: 'Credit' }]
}

export const caption: FigureCaptionElement = {
  type: 'figureCaption',
  children: [{ text: 'Legende ' }, byline]
}

export const figure = (
  src = '/static/editor/placeholder.png'
): FigureElement => ({
  type: 'figure',
  children: [{ type: 'figureImage', src, children: [emptyText] }, caption]
})
