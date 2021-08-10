import { ElementConfigI } from '../custom-types'
import { ContainerComponent } from '../editor/Element'
import { matchTemplateElement } from './helpers/normalization'
import { figure } from '../templates/figure'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  normalizations: [matchTemplateElement(figure())],
  attrs: {
    disableBreaks: true
  }
}
