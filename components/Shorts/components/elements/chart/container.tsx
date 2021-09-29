import { ElementConfigI } from '../../custom-types'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: [
    { type: 'chartTitle' },
    { type: 'chartLead' },
    { type: 'chart' },
    { type: 'chartLegend' }
  ],
  attrs: {
    disableBreaks: true
  }
}
