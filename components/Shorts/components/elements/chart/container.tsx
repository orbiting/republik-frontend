import { ElementConfigI } from '../../custom-types'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: ['chartTitle', 'chartLead', 'chart', 'chartLegend'],
  attrs: {
    disableBreaks: true
  }
}
