import { ElementConfigI } from '../../custom-types'
import { matchTemplateElement } from '../helpers/normalization'
import { chart } from '../../editor/DEPRECATED/chart'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: ['chartTitle', 'chartLead', 'chart', 'chartLegend'],
  normalizations: [matchTemplateElement(chart)],
  attrs: {
    disableBreaks: true
  }
}
