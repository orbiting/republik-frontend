import React from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'

import Lead from './Lead'
import Carpet from './Carpet'
import Team from './Team'
import Reasons from './Reasons'
import Sections from './Sections'
import Vision from './Vision'

const Marketing = ({ t }) => {
  return (
    <>
      <Lead t={t} />
      <Carpet t={t} />
      <Reasons t={t} />
      <Team t={t} />
      <Sections />
      <Vision t={t} />
    </>
  )
}

export default compose(withT)(Marketing)
