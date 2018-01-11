import {hierarchy} from 'd3-hierarchy'
import {nest} from 'd3-collection'
import {sum} from 'd3-array'

const data = [
  { Kategorie: 'Project R Gen',
    'Aktionärin': 'Project R',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '490000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Susanne Sugimoto',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '70000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Laurent Burst',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '70000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Nadja Schnetzler',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '70000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Christof Moser',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '70000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Constantin Seibt',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '70000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Clara Vuillemin',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '40000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Patrick Recher',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '40000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Thomas Preusse',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '10000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Richard Höchner',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '10000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Sylvie Reinhard',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '10000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'François Zosso',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '10000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'David Schärer',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '10000' },
  { Kategorie: 'Gründerteam',
    'Aktionärin': 'Tobias Peier',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '10000' },
  { Kategorie: 'Eigenaktien Republik',
    'Aktionärin': 'Republik AG',
    Typ: 'A',
    'Nominal CHF': '0.10',
    Anzahl: '20000' },
  { Kategorie: 'Geldgeber',
    'Aktionärin': 'Gebrüder Meili',
    Typ: 'B',
    'Nominal CHF': '0.40',
    Anzahl: '26111' },
  { Kategorie: 'Geldgeber',
    'Aktionärin': 'Mettiss AG',
    Typ: 'B',
    'Nominal CHF': '0.40',
    Anzahl: '4445' },
  { Kategorie: 'Geldgeber',
    'Aktionärin': 'Steff Fischer',
    Typ: 'B',
    'Nominal CHF': '0.40',
    Anzahl: '2778' }
]

export const groupped = hierarchy({
  children: nest()
    .key(d => d.Kategorie)
    .entries(data)
    .map(d => {
      if (d.values.length > 1) {
        return {
          ...d.values[0],
          Anzahl: undefined,
          children: d.values
        }
      }
      return d.values[0]
    })
}).sum(d => d.Anzahl)

export const total = sum(data, d => +d.Anzahl)
export const totalChf = sum(data, d => +d.Anzahl * d['Nominal CHF'])

export const colors = {
  Geldgeber: 'rgb(157, 38, 14)',
  Gründerteam: 'rgb(54, 71, 63)',
  'Eigenaktien Republik': '#979797',
  'Project R Gen': 'rgb(65, 171, 29)'
}
