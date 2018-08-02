import React from 'react'
import { compose } from 'react-apollo'
import Front from '../components/Front'
import withData from '../lib/apollo/withData'
import { enforceMembership } from '../components/Auth/withMembership'

const FrontPage = ({ url, headers }) => {
  return <Front url={url} headers={headers} />
}

export default compose(
  withData,
  enforceMembership
)(FrontPage)
