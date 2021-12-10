import React from 'react'
import { AnchorLink } from '../Anchors'
import PledgeList from './PledgeList'
type TransactionPropTypes = {
  t: (s: string) => string
  query: {
    id: string
  }
}

function Transactions({ t, query }: TransactionPropTypes) {
  return (
    <>
      <AnchorLink id='pledges'>{t('account/pledges/title')}</AnchorLink>
      <PledgeList highlightId={query.id} />
    </>
  )
}

export default Transactions
