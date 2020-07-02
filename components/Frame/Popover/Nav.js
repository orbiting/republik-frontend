import React, { useRef } from 'react'
import { compose } from 'react-apollo'

import { css } from 'glamor'
import Footer from '../Footer'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { matchPath } from '../../../lib/routes'
import withT from '../../../lib/withT'
import withInNativeApp from '../../../lib/withInNativeApp'

import { withMembership } from '../../Auth/checkRoles'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import { colors, fontStyles, mediaQueries, Label } from '@project-r/styleguide'

import NavLink, { NavA } from './NavLink'
import Sections from './Sections'

const styles = {
  container: css({
    minHeight: '100%'
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
  signInBlock: css({
    display: 'block',
    padding: 10,
    [mediaQueries.mUp]: {
      display: 'none'
    }
  }),
  signInInline: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'block'
    }
  }),
  sections: css({
    ...fontStyles.sansSerifRegular21,
    marginBottom: 40,
    paddingTop: 10,
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
  sectionsBlock: css({
    marginTop: 0,
    marginBottom: 15,
    display: 'inline-block',
    maxWidth: 190,
    [mediaQueries.mUp]: {
      maxWidth: 230
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
  signout: css({
    color: colors.text,
    marginTop: 5,
    fontSize: 16,
    lineHeight: '24px'
  })
}

const SignoutLink = ({ children, ...props }) => (
  <div {...styles.signout}>
    <NavA {...props}>{children}</NavA>
  </div>
)

const Nav = ({
  me,
  router,
  expanded,
  closeHandler,
  t,
  inNativeApp,
  inNativeIOSApp,
  isMember
}) => {
  const active = matchPath(router.asPath)
  const hasExpandedRef = useRef(expanded)
  if (expanded) {
    hasExpandedRef.current = true
  }
  return (
    <div {...styles.container} id='nav'>
      <hr {...styles.hr} {...styles.hrFixed} />
      {hasExpandedRef.current && (
        <>
          {!me && (
            <div {...styles.signInBlock}>
              <SignIn />
            </div>
          )}
          <div {...styles.sections}>
            <div {...styles.section} {...styles.sectionCompact}>
              {me && (
                <>
                  <NavLink
                    route='account'
                    active={active}
                    closeHandler={closeHandler}
                  >
                    {t('Frame/Popover/myaccount')}
                  </NavLink>
                  <NavLink
                    route='subscriptions'
                    active={active}
                    closeHandler={closeHandler}
                  >
                    {t('header/nav/notifications/aria')}
                  </NavLink>
                  {(!inNativeIOSApp || isMember) && (
                    <NavLink
                      route='profile'
                      params={{ slug: me.username || me.id }}
                      active={active}
                      closeHandler={closeHandler}
                    >
                      {t('Frame/Popover/myprofile')}
                    </NavLink>
                  )}
                  {isMember && (
                    <NavLink
                      route='bookmarks'
                      active={active}
                      closeHandler={closeHandler}
                    >
                      {t('nav/bookmarks')}
                    </NavLink>
                  )}
                  {me.accessCampaigns.length > 0 && (
                    <NavLink
                      route='access'
                      active={active}
                      closeHandler={closeHandler}
                    >
                      {t('nav/share')}
                    </NavLink>
                  )}
                </>
              )}
              {!inNativeIOSApp && !isMember && (
                <NavLink
                  route='pledge'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/offers')}
                </NavLink>
              )}
              {!inNativeIOSApp && (
                <NavLink
                  route='pledge'
                  params={{ group: 'GIVE' }}
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/give')}
                </NavLink>
              )}
              {!inNativeIOSApp && isMember && (
                <NavLink
                  route='pledge'
                  params={{ package: 'DONATE' }}
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/donate')}
                </NavLink>
              )}
              {me ? (
                <SignOut Link={SignoutLink} />
              ) : (
                <div {...styles.signInInline}>
                  <SignIn
                    beforeForm={
                      <Label
                        style={{
                          display: 'block',
                          marginTop: 20,
                          marginBottom: 10
                        }}
                      >
                        {t('me/signedOut')}
                      </Label>
                    }
                  />
                </div>
              )}
            </div>
            <div {...styles.section}>
              {isMember && (
                <>
                  <NavLink
                    route='index'
                    active={active}
                    closeHandler={closeHandler}
                  >
                    {t('navbar/front')}
                  </NavLink>
                  <NavLink
                    prefetch
                    route='feed'
                    active={active}
                    closeHandler={closeHandler}
                  >
                    {t('navbar/feed')}
                  </NavLink>
                </>
              )}
              <NavLink
                route='discussion'
                active={active}
                closeHandler={closeHandler}
                hoverColor={colors.primary}
              >
                {t('navbar/discussion')}
              </NavLink>
              {isMember && (
                <NavLink
                  route='search'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('header/nav/search/aria')}
                </NavLink>
              )}
              <NavLink
                route='sections'
                active={active}
                closeHandler={closeHandler}
              >
                {t('nav/sections')}
              </NavLink>
              <div {...styles.sectionCompact} {...styles.sectionsBlock}>
                <Sections active={active} closeHandler={closeHandler} />
              </div>
              <br />
              <NavLink
                inline
                route='cockpit'
                active={active}
                closeHandler={closeHandler}
              >
                {t('nav/cockpit')}
              </NavLink>
              <br />
              <NavLink
                inline
                route='events'
                active={active}
                closeHandler={closeHandler}
              >
                {t('nav/events')}
              </NavLink>
              <NavLink
                inline
                route='meta'
                active={active}
                closeHandler={closeHandler}
              >
                {t('nav/meta')}
              </NavLink>
              <NavLink
                inline
                route='legal/imprint'
                active={active}
                closeHandler={closeHandler}
              >
                {t('nav/team')}
              </NavLink>
            </div>
          </div>
        </>
      )}
      {inNativeApp && hasExpandedRef.current && <Footer />}
    </div>
  )
}

export default compose(withT, withInNativeApp, withMembership)(Nav)
