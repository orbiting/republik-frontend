import React from 'react'
import { compose } from 'react-apollo'
import Front from '../components/Front'
import withT from '../lib/withT'

const MetaPage = ({ t }) => {
  return <Front
    before={
      null
    }
    after={
      null
    }
    path='/verlag' />
}

export default compose(
  withT
)(MetaPage)
