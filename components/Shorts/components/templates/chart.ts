import { ChartBlockElement } from '../custom-types'
import { emptyElement } from './text'

export const chart: ChartBlockElement = {
  type: 'chartBlock',
  children: [
    {
      type: 'chartTitle',
      children: [
        {
          text: 'Die Belastung stieg scharf – und sank wieder'
        }
      ]
    },
    {
      type: 'chartLead',
      children: [{ text: 'Psychische Belastung, standardisierte Skala' }]
    },
    {
      type: 'chart',
      config: {
        type: 'TimeBar',
        color: 'type',
        xTicks: [],
        domain: [0, 0.3],
        yTicks: [],
        colorRange: ['#02601e'],
        numberFormat: '%',
        x: 'jahr',
        xScale: 'ordinal',
        sort: 'none',
        padding: 0,
        xBandPadding: 0.5,
        size: 'narrow'
      },
      values: [
        {
          jahr: '2016',
          value: '0.2'
        },
        {
          jahr: '2017',
          value: '0.22'
        },
        {
          jahr: '2018',
          value: '0.25'
        },
        {
          jahr: '2019',
          value: '0.24'
        },
        {
          jahr: 'Mitte 20',
          value: '0.14'
        },
        {
          jahr: 'Ende 20',
          value: '0.2'
        }
      ],
      ...emptyElement
    },
    {
      type: 'chartLegend',
      children: [
        {
          text:
            'Insgesamt 7319 Personen wurden acht Mal befragt, jedes Mal antworteten zwischen 5000 und 6000 Personen. Die Abstände zwischen den Erhebungs­zeiträumen sind, wie die Zeit­räume selbst, unterschiedlich gross: 10.–18. März; 1.–14. April; 15.–28. April, 29. April bis 12. Mai, 13.–26. Mai, 27. Mai bis 9. Juni, 10.–23. Juni, 24. Juni bis 20. Juli. Quelle: M. Daly & E. Robinson (2021): «'
        },
        {
          type: 'link',
          href:
            'https://www.sciencedirect.com/science/article/pii/S0022395620310384?via%3Dihub',
          children: [
            {
              text:
                'Psychological Distress and Adaptation to the Covid-19 Crisis in the United States'
            }
          ]
        },
        {
          text: '». «Journal of Psychiatric Research» 136.'
        }
      ]
    }
  ]
}
