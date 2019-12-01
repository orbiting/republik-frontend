import React from 'react'
import { compose } from 'react-apollo'

import { css } from 'glamor'
import Footer from '../Footer'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { Link, matchPath, Router } from '../../../lib/routes'
import withT from '../../../lib/withT'
import withInNativeApp from '../../../lib/withInNativeApp'

import { withMembership } from '../../Auth/checkRoles'
import { shouldIgnoreClick } from '../../Link/utils'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import {
  colors,
  fontStyles,
  mediaQueries,
  Label,
  Editorial
} from '@project-r/styleguide'

const styles = {
  container: css({
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  }),
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    height: 1,
    color: colors.divider,
    backgroundColor: colors.divider,
    width: '100%'
  }),
  hrFixed: css({
    position: 'fixed',
    top: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT - 1
    }
  }),
  sections: css({
    ...fontStyles.sansSerifRegular19,
    flexGrow: 1,
    marginBottom: 20,
    paddingTop: 10,
    [mediaQueries.mUp]: {
      paddingTop: 20
    },
    display: 'flex',
    justifyContent: 'space-between',
    [mediaQueries.mUp]: {
      fontSize: 28,
      lineHeight: '42px'
    }
  }),
  sectionCompact: css({
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }),
  section: css({
    padding: '0 10px',
    [mediaQueries.mUp]: {
      padding: '0 25px'
    },
    '&:first-child': {
      [mediaQueries.mUp]: {
        padding: '0 10px'
      }
    },
    '&:last-child': {
      textAlign: 'right'
    }
  }),
  link: css({
    display: 'block',
    textDecoration: 'none',
    color: colors.text,
    ':visited': {
      color: colors.text
    },
    '@media (hover)': {
      ':hover': {
        color: colors.primary
      }
    },
    cursor: 'pointer'
  }),
  signout: css({
    color: colors.text,
    marginTop: 5,
    fontSize: 16,
    lineHeight: '24px'
  })
}

const SignoutLink = ({ children, ...props }) => (
  <div {...styles.signout}>
    <Editorial.A {...props}>{children}</Editorial.A>
  </div>
)

const NavLink = ({ route, translation, params = {}, active, closeHandler }) => {
  if (active && active.route === route) {
    return (
      <a
        {...styles.link}
        style={{ cursor: 'pointer' }}
        onClick={e => {
          e.preventDefault()
          Router.replaceRoute(route, params).then(() => {
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

const Nav = ({
  me,
  router,
  closeHandler,
  children,
  t,
  inNativeApp,
  inNativeIOSApp,
  isMember
}) => {
  const active = matchPath(router.asPath)
  return (
    <div {...styles.container} id='nav'>
      <hr {...styles.hr} {...styles.hrFixed} />
      <div {...styles.sections}>
        <div {...styles.section} {...styles.sectionCompact}>
          {me && (
            <>
              <NavLink
                route='account'
                translation={t('Frame/Popover/myaccount')}
                active={active}
                closeHandler={closeHandler}
              />
              {(!inNativeIOSApp || isMember) && (
                <NavLink
                  route='profile'
                  params={{ slug: me.username || me.id }}
                  translation={t('Frame/Popover/myprofile')}
                  active={active}
                  closeHandler={closeHandler}
                />
              )}
              {isMember && (
                <NavLink
                  route='bookmarks'
                  translation={t('nav/bookmarks')}
                  active={active}
                  closeHandler={closeHandler}
                />
              )}
              {me.accessCampaigns.length > 0 && (
                <a
                  {...styles.link}
                  style={{ cursor: 'pointer' }}
                  href='/konto#teilen'
                  onClick={e => {
                    if (shouldIgnoreClick(e)) {
                      return
                    }

                    Router.pushRoute('/konto#teilen').then(closeHandler)
                  }}
                >
                  {t('nav/share')}
                </a>
              )}
            </>
          )}
          {!inNativeIOSApp && (
            <NavLink
              route='pledge'
              params={isMember ? { group: 'GIVE' } : undefined}
              translation={t(isMember ? 'nav/give' : 'nav/offers')}
              active={active}
              closeHandler={closeHandler}
            />
          )}
          {!inNativeIOSApp && isMember && (
            <NavLink
              route='pledge'
              params={{ package: 'DONATE' }}
              translation={t('nav/donate')}
              active={active}
              closeHandler={closeHandler}
            />
          )}
          {me ? (
            <>
              <SignOut Link={SignoutLink} />
            </>
          ) : (
            <SignIn
              beforeForm={
                <Label
                  style={{ display: 'block', marginTop: 20, marginBottom: 10 }}
                >
                  {t('me/signedOut')}
                </Label>
              }
            />
          )}
        </div>
        <div {...styles.section}>
          {isMember && (
            <NavLink
              route='feed'
              translation={t('navbar/feed')}
              active={active}
              closeHandler={closeHandler}
            />
          )}
          {isMember && (
            <NavLink
              route='discussion'
              translation={t('navbar/discussion')}
              active={active}
              closeHandler={closeHandler}
            />
          )}
          {isMember && (
            <NavLink
              route='formats'
              translation={t('nav/formats')}
              active={active}
              closeHandler={closeHandler}
            />
          )}
          <NavLink
            route='community'
            translation={t('nav/community')}
            active={active}
            closeHandler={closeHandler}
          />
          <NavLink
            route='events'
            translation={t('nav/events')}
            active={active}
            closeHandler={closeHandler}
          />
          <NavLink
            route='meta'
            translation={t('nav/meta')}
            active={active}
            closeHandler={closeHandler}
          />
          <NavLink
            route='legal/imprint'
            translation={t('nav/team')}
            active={active}
            closeHandler={closeHandler}
          />
        </div>
      </div>
      {inNativeApp && <Footer />}
    </div>
  )
}

export default compose(
  withT,
  withInNativeApp,
  withMembership
)(Nav)
