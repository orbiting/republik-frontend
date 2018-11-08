import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import Page from '../components/Feedback/Page'

const FeedbackPage = ({ router }) => {
  return (
    <Page query={router.query} />
  )
}

export default compose(
  withRouter
)(FeedbackPage)
