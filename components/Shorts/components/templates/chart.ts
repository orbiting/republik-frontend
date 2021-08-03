import { ChartBlockElement } from '../custom-types'
import { emptyElement } from './text'

export const chart: ChartBlockElement = {
  type: 'chartBlock',
  children: [
    { type: 'chartTitle', children: [{ text: 'Titel' }] },
    { type: 'chartLead', children: [{ text: 'Lead' }] },
    {
      type: 'chart',
      config: {
        type: 'Bar',
        numberFormat: '.0%',
        y: 'country',
        color: 'highlight',
        showBarValues: true
      },
      values: [
        {
          country: 'Österreich',
          value: '0.435',
          highlight: 0
        },
        {
          country: 'Deutschland',
          value: '0.369',
          highlight: 0
        },
        {
          country: 'Schweiz',
          value: '0.279',
          highlight: 1
        },
        {
          country: 'USA',
          value: '0.264',
          highlight: 0
        }
      ],
      ...emptyElement
    },
    { type: 'chartLegend', children: [{ text: 'Legende.' }] }
  ]
}
