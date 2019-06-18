import { sum } from 'd3-array'
import { colors } from '@project-r/styleguide'
import { vt } from '../voteT'

export const displayAmount = amount => `${amount / 1000000} Mio. CHF`

export const data = [
  { key: 'redaktion',
    label: 'Redaktion',
    amount: 5700000,
    color: colors.discrete[0],
    more: vt('vote/201907/budget/redaktion/more')
  },
  { key: 'IT',
    label: 'IT',
    amount: 1400000,
    color: colors.discrete[1],
    more: vt('vote/201907/budget/it/more')
  },
  { key: 'community',
    label: 'Community',
    amount: 1400000,
    color: colors.discrete[2],
    more: vt('vote/201907/budget/community/more')
  },
  { key: 'finance',
    label: 'Betrieb & Finanzen',
    amount: 700000,
    color: colors.discrete[3],
    more: vt('vote/201907/budget/finance/more')
  },
  { key: 'management',
    label: 'Leitung',
    amount: 800000,
    color: colors.discrete[4],
    more: vt('vote/201907/budget/management/more')
  }
]

export const total = sum(data, d => +d.amount)
