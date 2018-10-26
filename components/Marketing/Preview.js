import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import {
  A,
  Container,
  Interaction
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'
import Frame from '../Frame'
import Box from '../Frame/Box'
import SignUp from './SignUp'
import Front from '../Front'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import withMembership from '../Auth/withMembership'

const Prestitial = ({ me, isMember, t }) => {
  const text = me && !isMember
    ? t.elements(
      'marketing/preview/prestitial/noMembership',
      { link: <Link route='pledge'><A style={{ cursor: 'pointer' }}><br />{t('marketing/preview/prestitial/noMembership/link')}</A></Link> }
    )
    : t('marketing/preview/prestitial/withMembership')

  return (
    <Interaction.P style={{ textAlign: 'center' }}>
      {text}
    </Interaction.P>
  )
}

const Preview = ({ me, isMember, meta, t }) => {
  return <Fragment>
    {!me && <Frame raw meta={meta}>
      <Container style={{ maxWidth: '665px' }}>
        <SignUp />
      </Container>
    </Frame>
    }
    {me && <Front
      before={
        <Box>
          <Container>
            <Prestitial me={me} isMember={isMember} t={t} />
          </Container>
        </Box>
      }
      meta={meta}
      path='/preview-front'
    />}
  </Fragment>
}

export default compose(
  withT,
  withMe,
  withMembership
)(Preview)
