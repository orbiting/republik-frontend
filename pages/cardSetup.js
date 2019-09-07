import React from 'react'
import { withRouter } from 'next/router'

import Frame from '../components/Frame'
import CardClaim from '../components/Card/Claim'
import CardUpdate from '../components/Card/Update'

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
      <CardUpdate />
    </Frame>
  )
}

export default withRouter(Page)
