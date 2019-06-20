import { hierarchy } from 'd3-hierarchy'
import { nest } from 'd3-collection'
import { sum } from 'd3-array'
import { colors } from '@project-r/styleguide'
import { vt } from '../voteT'

export const data = [
  {
    category: 'Redaktion',
    label: 'Schreibend',
    pk: 1785971,
    sk: 365000,
    color: colors.discrete[0],
    more: vt('vote/201907/budget/redaktion/more')
  },
  {
    category: 'Redaktion',
    label: 'Bild',
    pk: 174857,
    sk: 246800
  },
  {
    category: 'Redaktion',
    label: 'Multimedia',
    pk: 107793,
    sk: 64800
  },
  {
    category: 'Redaktion',
    label: 'Produktion',
    pk: 370682,
    sk: 87200
  },
  {
    category: 'Redaktion',
    label: 'Ausbildung',
    pk: 108885,
    sk: 4800
  },
  {
    category: 'Redaktion',
    label: 'Rechercheetat',
    pk: 0,
    sk: 120000
  },
  {
    category: 'IT',
    label: 'Backend',
    pk: 1000000,
    sk: 0,
    color: colors.discrete[1],
    more: vt('vote/201907/budget/it/more')
  },
  {
    category: 'IT',
    label: 'Frontend',
    pk: 400000,
    sk: 0
  },
  {
    category: 'Community',
    pk: 1400000,
    sk: 0,
    color: colors.discrete[2],
    more: vt('vote/201907/budget/community/more')
  },
  {
    category: 'Betrieb & Finanzen',
    pk: 700000,
    sk: 0,
    color: colors.discrete[3],
    more: vt('vote/201907/budget/finance/more')
  },
  {
    category: 'Leitung',
    pk: 800000,
    sk: 0,
    color: colors.discrete[4],
    more: vt('vote/201907/budget/management/more')
  }
]

export const total = sum(data, d => +(d.pk + d.sk))

export const grouped = hierarchy({
  children: nest()
    .key(d => d.category)
    .entries(data)
    .map(d => {
      if (d.values.length > 1) {
        return {
          ...d.values[0],
          // category: undefined,
          amount: sum(d.values, v => +(v.pk + v.sk)),
          fraction: sum(d.values, v => +(v.pk + v.sk)) / total,
          pk: sum(d.values, v => +v.pk),
          sk: sum(d.values, v => +v.sk),
          children: d.values.map(c => {
            return {
              ...c,
              amount: c.pk + c.sk,
              fraction: (c.pk + c.sk) / total
            }
          })
        }
      }
      return {
        ...d.values[0],
        amount: d.values[0].pk + d.values[0].sk
      }
    })
}).sum(d => d.Anzahl)
