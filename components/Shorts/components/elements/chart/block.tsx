import { ElementConfigI } from '../../custom-types'
import { matchTemplateElement } from '../helpers/normalization'
import { chart } from '../../templates/chart'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  normalizations: [matchTemplateElement(chart)],
  attrs: {
    disableBreaks: true
  }
}
