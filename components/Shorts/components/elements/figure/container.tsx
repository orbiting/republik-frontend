import { ElementConfigI } from '../../custom-types'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: ['figureImage', 'figureCaption'],
  attrs: {
    disableBreaks: true
  }
}
