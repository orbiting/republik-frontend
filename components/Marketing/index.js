import React from 'react'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import LeadSection from './Sections/Lead'

const Marketing = ({ t }) => {
  return (
    <>
      <LeadSection t={t} />
    </>
  )
}

export default compose(withT)(Marketing)
