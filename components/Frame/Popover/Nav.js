import React from 'react'

import { css } from 'glamor'
import Footer from '../Footer'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { matchPath, Link, Router } from '../../../lib/routes'
import withT from '../../../lib/withT'

import {
  Interaction,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }),
  sections: css({
    ...fontStyles.sansSerifRegular21,
    flex: 1,
    paddingTop: '20px',
    [mediaQueries.mUp]: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }),
  section: css({
    margin: '0px 20px',
    '& + &': {
      borderTop: `1px solid ${colors.divider}`,
      margin: '25px 20px',
      paddingTop: '25px'
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

const NavLink = ({ route, translation, params = {}, active, closeHandler }) => {
  if (
    active &&
    active.route === route
  ) {
    return (
      <a
        {...styles.link}
        style={{ cursor: 'pointer' }}
        onClick={e => {
          e.preventDefault()
          Router.replaceRoute(route, params)
            .then(() => {
              window.scroll(0, 0)
              closeHandler()
            })
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

const Nav = ({ me, url, closeHandler, children, t, inNativeApp }) => {
  const active = matchPath(url.asPath)
  return (
    <div {...styles.container} id='nav'>
      <div {...styles.sections}>
        <div {...styles.section}>
          {me && (
            <div>
              <NavLink
                route='account'
                translation={t('Frame/Popover/myaccount')}
                active={active}
                closeHandler={closeHandler}
              />
              <br />
              <NavLink
                route='profile'
                params={{ slug: me.username || me.id }}
                translation={t('Frame/Popover/myprofile')}
                active={active}
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
                route='feed'
                translation={t('nav/feed')}
                active={active}
                closeHandler={closeHandler}
              />
              <br />
              <NavLink
                route='formats'
                translation={t('nav/formats')}
                active={active}
                closeHandler={closeHandler}
              />
              <br />
              <NavLink
                route='events'
                translation={t('nav/events')}
                active={active}
                closeHandler={closeHandler}
              />
              <br />
            </div>
          )}
          <NavLink
            route='community'
            translation={t('nav/community')}
            active={active}
            closeHandler={closeHandler}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default withT(Nav)
