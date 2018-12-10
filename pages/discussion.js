import React from 'react'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'
import { withRouter } from 'next/router'
import Page from '../components/Feedback/Page'

const DiscussionPage = ({ router: { query } }) => (
  <Page query={query} />
)

export default compose(
  enforceMembership(),
  withRouter
)(DiscussionPage)
