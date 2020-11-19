import React from 'react'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import Lead from './Lead'
import Team from './Team'
import Reasons from './Reasons'
import Sections from './Sections'
import Vision from './Vision'
import Pledge from '../Pledge/Form'

const Marketing = ({ t }) => {
  return (
    <>
      <Lead t={t} />
      <Team t={t} />
      <Reasons t={t} />
      <Sections />
      <Vision t={t} />
    </>
  )
}

export default compose(withT)(Marketing)
