import { ChartBlockElement } from '../custom-types'
import { emptyElement } from './text'

export const chart: ChartBlockElement = {
  type: 'chartBlock',
  children: [
    {
      type: 'chartTitle',
      children: [{ text: 'Wenns geht, Bahn, Velo und Tram nutzen' }]
    },
    {
      type: 'chartLead',
      children: [{ text: 'Treibhausgasemissionen über den Lebenszyklus' }]
    },
    {
      type: 'chart',
      config: {
        type: 'ScatterPlot',
        y: 'y',
        x: 'value',
        xUnit: 'Gramm CO₂-Äquivalente pro Personenkilometer',
        xTicks: [0.01, 100, 200, 300, 400, 500],
        xNice: 0,
        color: 'color',
        colorMap: {
          'restliche Verkehrsmittel': '#888888',
          'E-Auto': '#1f77b4',
          Verbrenner: 'rgb(187,21,26)'
        },
        colorLegendValues: ['E-Auto', 'Verbrenner', 'restliche Verkehrsmittel'],
        colorSort: 'none',
        yTicks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        yNice: 0,
        height: 240,
        paddingTop: 20,
        inlineLabel: 'inlineLabel',
        inlineLabelPosition: 'inlineLabelPosition',
        sizeRange: [7, 7],
        tooltipLabel: '{verkehrsmittel}',
        tooltipBody: '{x} g CO₂ pro km',
        opacity: 0.8,
        yLines: [
          {
            tick: 1,
            label: 'Typisches Auto mit Verbrennungsmotor'
          },
          {
            tick: 2,
            label: 'Flugzeug (Europa)'
          },
          {
            tick: 3,
            label: 'Autobus'
          },
          {
            tick: 4,
            label: 'Motorrad'
          },
          {
            tick: 5,
            label: 'Typisches E-Auto'
          },
          {
            tick: 6,
            label: 'Tram'
          },
          {
            tick: 7,
            label: 'E-Bike'
          },
          {
            tick: 8,
            label: 'Fahrrad'
          },
          {
            tick: 9,
            label: 'Bahn'
          }
        ]
      },
      values: [
        {
          verkehrsmittel: 'Bahn',
          value: '7',
          y: '9',
          size: 10,
          color: 'restliche Verkehrsmittel'
        },
        {
          verkehrsmittel: 'Fahrrad',
          value: '8',
          y: '8',
          size: 10,
          color: 'restliche Verkehrsmittel'
        },
        {
          verkehrsmittel: 'E-Bike',
          value: '14',
          y: '7',
          size: 10,
          color: 'restliche Verkehrsmittel'
        },
        {
          verkehrsmittel: 'Tram',
          value: '44',
          y: '6',
          size: 10,
          color: 'restliche Verkehrsmittel'
        },
        {
          verkehrsmittel: 'Typisches E-Auto',
          value: '143',
          y: '5',
          size: 10,
          color: 'E-Auto'
        },
        {
          verkehrsmittel: 'Motorrad',
          value: '149',
          y: '4',
          size: 10,
          color: 'restliche Verkehrsmittel'
        },
        {
          verkehrsmittel: 'Autobus',
          value: '153',
          y: '3',
          size: 10,
          color: 'restliche Verkehrsmittel'
        },
        {
          verkehrsmittel: 'Flugzeug (Europa)',
          value: '318',
          y: '2',
          size: 10,
          color: 'restliche Verkehrsmittel'
        },
        {
          verkehrsmittel: 'Typisches Auto mit Verbrennungsmotor',
          value: '334',
          y: '1',
          size: 10,
          color: 'Verbrenner'
        }
      ],
      ...emptyElement
    },
    {
      type: 'chartLegend',
      children: [
        {
          text:
            'Passagiere pro Auto: 1. Bei der realen, durchschnittlichen Belegungszahl von 1,6 reduzieren sich die Emissionen pro Kilometer um 38 Prozent. Quelle: '
        },
        {
          type: 'link',
          href:
            'https://www.mobitool.ch/de/tools/mobitool-faktoren-v2-1-25.html',
          children: [
            {
              text: 'Mobitool'
            }
          ]
        }
      ]
    }
  ]
}
