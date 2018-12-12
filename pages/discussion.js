import React from 'react'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'
import { withRouter } from 'next/router'
import Page from '../components/Feedback/Page'

const DiscussionPage = ({ router: { asPath, query } }) => (
  <Page query={query} asPath={asPath} />
)

export default compose(
  enforceMembership(),
  withRouter
)(DiscussionPage)
