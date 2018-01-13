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
      '&:first-child': {
        paddingLeft: '25px'
      },
      '&:last-child': {
        marginRight: 0,
        paddingRight: '25px',
        textAlign: 'right'
      }
    }
  }),
  link: css({
    textDecoration: 'none',
    color: colors.text,
    ':visited': {
      color: colors.text
    },
    ':hover': {
      color: colors.primary
    },
    cursor: 'pointer',
    [mediaQueries.mUp]: {
      fontSize: 48,
      lineHeight: '80px'
    }
  })
}

const SignoutLink = ({children, ...props}) => (
  <a {...styles.link} {...props}>{children}</a>
)

const NavLink = ({ route, translation, params, url, closeHandler }) => {
  if (`/${route}` === url.pathname) {
    return (
      <a
        {...styles.link}
        style={{ cursor: 'pointer' }}
        onClick={e => {
          e.preventDefault()
          closeHandler()
        }}
      >
        {translation}
      </a>
    )
  }
  return (
    <Link route={route} params={params}>
      <a {...styles.link}>{translation}</a>
    </Link>
  )
}

const Nav = ({ me, url, closeHandler, children, t }) => {
  return (
    <div {...styles.container}>
      <div {...styles.section}>
        {me && (
          <div>
            <NavLink
              route="account"
              translation={t('Frame/Popover/myaccount')}
              url={url}
              closeHandler={closeHandler}
            />
            <br />
            <NavLink
              route="profile"
              params={{ slug: me.username || me.id }}
              translation={t('Frame/Popover/myprofile')}
              url={url}
              closeHandler={closeHandler}
            />
            <br />
          </div>
        )}
        {me ? (
          <SignOut Link={SignoutLink} />
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
            <NavLink
              route="feed"
              translation={t('nav/feed')}
              url={url}
              closeHandler={closeHandler}
            />
            <br />
            <NavLink
              route="events"
              translation={t('nav/events')}
              url={url}
              closeHandler={closeHandler}
            />
            <br />
          </div>
        )}
        <NavLink
          route="community"
          translation={t('nav/community')}
          url={url}
          closeHandler={closeHandler}
        />
      </div>
    </div>
  )
}

export default withT(Nav)
