import React from 'react'

import { css } from 'glamor'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { Link } from '../../../lib/routes'
import withT from '../../../lib/withT'

import {
  Interaction,
  colors,
  fontStyles,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    ...fontStyles.sansSerifRegular21,
    paddingTop: '20px',
    [mediaQueries.mUp]: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }),
  section: css({
    '& + &': {
      borderTop: `1px solid ${colors.divider}`,
      margin: '25px 0',
      padding: '25px 0'
    },
    [mediaQueries.mUp]: {
      '& + &': {
        borderTop: 'none',
        margin: '0 50px',
        padding: '0 50px'
      },
      '&:last-child': {
        marginRight: 0,
        paddingRight: '20px'
      }
    }
  })
}

const Nav = ({ me, children, t }) => (
  <div {...styles.container}>
    <div {...styles.section}>
      {me && (
        <div>
          <Link route='account'>
            <a {...linkRule}>{t('Frame/Popover/myaccount')}</a>
          </Link>
          <br />
          <Link route='profile' params={{ slug: me.username || me.id }}>
            <a {...linkRule}>{t('Frame/Popover/myprofile')}</a>
          </Link>
          <br />
        </div>
      )}
      {me ? (
        <SignOut />
      ) : (
        <div>
          <Interaction.P style={{ marginBottom: '20px' }}>
            {t('me/signedOut')}
          </Interaction.P>
          <SignIn />
        </div>
      )}
      <br />
    </div>
    <div {...styles.section}>
      {me && (
        <div>
          <Link route='feed'>
            <a {...linkRule}>{t('nav/feed')}</a>
          </Link>
          <br />
          <Link route='events'>
            <a {...linkRule}>{t('nav/events')}</a>
          </Link>
          <br />
        </div>
      )}

      <Link route='community'>
        <a {...linkRule}>{t('nav/community')}</a>
      </Link>
    </div>
  </div>
)

export default withT(Nav)
