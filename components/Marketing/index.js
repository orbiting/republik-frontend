import React from 'react'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import LeadSection from './Sections/Lead'
import TeamSection from './Sections/Team'
import ReasonsSection from './Sections/Reasons'
import SectionsSection from './Sections/Sections'

const Marketing = ({ t }) => {
  return (
    <>
      <LeadSection t={t} />
      <TeamSection t={t} />
      <ReasonsSection t={t} />
      <SectionsSection t={t} />
    </>
  )
}

export default compose(withT)(Marketing)
