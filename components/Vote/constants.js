import {
  ELECTION_COOP_MEMBERS_SLUG,
  ELECTION_COOP_PRESIDENT_SLUG,
  VOTING_COOP_ACCOUNTS_SLUG,
  VOTING_COOP_BOARD_SLUG,
  VOTING_COOP_BUDGET_SLUG,
  VOTING_COOP_DISCHARGE_SLUG
} from '../../lib/constants'

export {
  ELECTION_COOP_MEMBERS_SLUG,
  ELECTION_COOP_PRESIDENT_SLUG
} from '../../lib/constants'

export const VOTING_COOP_201907_BUDGET_SLUG = 'gen19budget'

export const VOTINGS = [
  { slug: VOTING_COOP_ACCOUNTS_SLUG, id: 'accounts' },
  { slug: VOTING_COOP_DISCHARGE_SLUG, id: 'discharge' },
  { slug: VOTING_COOP_BUDGET_SLUG, id: 'budget' },
  { slug: VOTING_COOP_BOARD_SLUG, id: 'board' }
]

export const VOTINGS_COOP_201907 = [
  { slug: VOTING_COOP_201907_BUDGET_SLUG, id: 'budget19' },
  { slug: 'gen19revision', id: 'revision19' }
]

export const VOTING_COOP_201912_REPORT_SLUG = 'gen1819report'

export const VOTINGS_COOP_201912 = [
  { slug: VOTING_COOP_201912_REPORT_SLUG, id: 'gen1819report' },
  { slug: 'gen1819accounts', id: 'gen1819accounts' },
  { slug: 'gen19discharge', id: 'gen19discharge' },
  { slug: 'gen1920revision', id: 'gen1920revision' }
]

export const ELECTIONS = [
  { slug: ELECTION_COOP_PRESIDENT_SLUG, id: 'president' },
  { slug: ELECTION_COOP_MEMBERS_SLUG, id: 'members' }
]
