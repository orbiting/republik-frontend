import React from 'react'
import { withRouter } from 'next/router'

import Frame from '../components/Frame'
import CardClaim from '../components/Card/Claim'
import CardUpsert from '../components/Card/Upsert'

const Page = ({ router }) => {
  const { token } = router.query

  if (token) {
    return (
      <Frame>
        <CardClaim />
      </Frame>
    )
  }

  return (
    <Frame>
      <CardUpsert />
    </Frame>
  )
}

export default withRouter(Page)
