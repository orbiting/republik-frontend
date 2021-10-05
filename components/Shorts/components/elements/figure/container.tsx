import { ElementConfigI } from '../../../custom-types'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: [{ type: 'figureImage' }, { type: 'figureCaption' }],
  attrs: {
    disableBreaks: true
  }
}
