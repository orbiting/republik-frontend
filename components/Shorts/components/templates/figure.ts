import { FigureCaptionElement, FigureElement } from '../custom-types'
import { emptyText } from './text'

export const caption: FigureCaptionElement = {
  type: 'figureCaption',
  children: [{ text: 'Legende' }]
}

export const figure = (
  src = 'https://cdn.repub.ch/s3/republik-assets/repos/republik/article-juden-eigentlich-unerwuenscht/images/f28db19976d7da3d677acb53a64413b841306b73.jpeg'
): FigureElement => ({
  type: 'figure',
  children: [
    { type: 'figureImage', src, children: [emptyText] },
    {
      type: 'figureCaption',
      children: [
        {
          text:
            '«Kein Ostergruss!» – das war gleichsam die Höchst­strafe für nicht genehme Gäste: Karteikarte aus dem Grandhotel Waldhaus in Vulpera. Lois Hechenblaikner'
        }
      ]
    }
  ]
})
