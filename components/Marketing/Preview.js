import React from 'react'
import { compose } from 'react-apollo'

import {
  Container
} from '@project-r/styleguide'

import withMe from '../../lib/apollo/withMe'

import SignUp from './SignUp'
import PreviewFront from './PreviewFront'

const Preview = ({ me, url }) => {
  return (
    <Container style={{ maxWidth: '665px' }}>
      {!me && <SignUp />}
      {me && <PreviewFront url={url} />}
    </Container>
  )
}

export default compose(
  withMe
)(Preview)
