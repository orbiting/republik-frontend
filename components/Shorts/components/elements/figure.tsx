import { ElementConfigI } from '../custom-types'
import { ContainerComponent } from '../editor/Element'
import {
  matchTemplateElement,
  singleCaptionNode
} from './helpers/normalization'
import { figure } from '../templates/figure'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  normalizations: [matchTemplateElement(figure()), singleCaptionNode]
}
