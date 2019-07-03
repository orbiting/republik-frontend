import { hierarchy } from 'd3-hierarchy'
import { nest } from 'd3-collection'
import { sum } from 'd3-array'
import { colors } from '@project-r/styleguide'
import { vt } from '../voteT'

const t = key => vt(`vote/201907/budget/${key}`)

// pk: Personalkosten
// sk: Sachkosten

const data = [
  {
    category: t('redaktion'),
    label: t('redaktion/0'),
    pk: 1788662,
    sk: 365000,
    background: colors.discrete[0],
    more: t('redaktion/more')
  },
  {
    category: t('redaktion'),
    label: t('redaktion/1'),
    pk: 108885,
    sk: 4800
  },
  {
    category: t('redaktion'),
    label: t('redaktion/2'),
    pk: 0,
    sk: 120000
  },
  {
    category: t('redaktion'),
    label: t('redaktion/3'),
    pk: 174857,
    sk: 246800
  },
  {
    category: t('redaktion'),
    label: t('redaktion/4'),
    pk: 74291,
    sk: 82400
  },
  {
    category: t('redaktion'),
    label: t('redaktion/5'),
    pk: 382682,
    sk: 77600
  },
  {
    category: t('it'),
    label: t('it/0'),
    pk: 533903,
    sk: 185400,
    background: colors.discrete[1],
    more: t('it/more')
  },
  {
    category: t('it'),
    label: t('it/1'),
    pk: 96000,
    sk: 40000
  },
  {
    category: t('community'),
    label: t('community'),
    pk: 422699,
    sk: 394000,
    background: colors.discrete[2],
    more: t('community/more')
  },
  {
    category: t('management'),
    label: t('management/0'),
    pk: 146800,
    sk: 190300,
    background: colors.discrete[3],
    more: t('management/more')
  },
  {
    category: t('management'),
    label: t('management/1'),
    pk: 34300,
    sk: 88000
  },
  {
    category: t('services'),
    label: t('services'),
    pk: 177692,
    sk: 248600,
    background: colors.discrete[4],
    more: t('services/more')
  }
]

export const total = sum(data, d => +(d.pk + d.sk))

export const budgetData = hierarchy({
  children: nest()
    .key(d => d.category)
    .entries(data)
    .map(d => {
      return {
        ...d.values[0],
        total: sum(d.values, v => +(v.pk + v.sk)),
        fraction: sum(d.values, v => +(v.pk + v.sk)) / total,
        pk: sum(d.values, v => +v.pk),
        sk: sum(d.values, v => +v.sk),
        children: d.values.map(c => {
          return {
            ...c,
            total: c.pk + c.sk,
            fraction: (c.pk + c.sk) / total
          }
        })
      }
    })
}).sum(d => d.Anzahl)
