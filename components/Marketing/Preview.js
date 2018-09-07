import React, {Fragment} from 'react'
import { compose } from 'react-apollo'
import {css} from 'glamor'
import {
  A,
  Container,
  Interaction,
  mediaQueries,
  colors
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'
import Frame, { Box } from '../Frame'
import SignUp from './SignUp'
import Front from '../Front'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import withMembership from '../Auth/withMembership'

const styles = {
  noMember: css({
    margin: '0 -15px',
    backgroundColor: colors.primaryBg,
    textAlign: 'center',
    padding: '18px 0',
    [mediaQueries.mUp]: {
      padding: '30px 0'
    }
  })
}

const Prestitial = ({ me, isMember, t }) => {
  const text = me && !isMember
    ? t.elements(
      'marketing/preview/prestitial/noMembership',
      { link: <Link route='pledge'><A style={{cursor: 'pointer'}}><br />{t('marketing/preview/prestitial/noMembership/link')}</A></Link> }
    )
    : t('marketing/preview/prestitial/withMembership')

  return <div {...styles.noMember}>
    <Interaction.P>
      {text}
    </Interaction.P>
  </div>
}

const Preview = ({ me, isMember, url, meta, t }) => {
  return <Fragment>
    {!me && <Frame raw url={url} meta={meta}>
      <Container style={{ maxWidth: '665px' }}>
        <SignUp />
      </Container>
    </Frame>
    }
    {me && <Front
      url={url}
      beforeNote={
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
