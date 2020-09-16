import React, { Fragment, useRef, useEffect, useState } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import {
  useColorContext,
  fontStyles,
  mediaQueries,
  Center,
  Button,
  Loader
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import withT from '../../../lib/withT'
import withInNativeApp from '../../../lib/withInNativeApp'
import { Link, matchPath } from '../../../lib/routes'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { withMembership } from '../../Auth/checkRoles'
import Footer from '../Footer'
import NavLink, { NavA } from './NavLink'
import NotificationFeedMini from '../../Notifications/NotificationFeedMini'
import BookmarkMiniFeed from '../../Bookmarks/BookmarkMiniFeed'
import { useColorSchemeKey } from '../../ColorScheme/lib'

const SignoutLink = ({ children, ...props }) => (
  <div {...styles.signout}>
    <NavA {...props}>{children}</NavA>
  </div>
)

const UserNav = ({
  me,
  router,
  expanded,
  closeHandler,
  t,
  inNativeApp,
  inNativeIOSApp,
  isMember
}) => {
  const [containerPadding, setContainerPadding] = useState()
  const containerRef = useRef(null)
  useEffect(() => {
    const measureLeftPadding = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const windowWidth = window.innerWidth
        setContainerPadding((windowWidth - containerWidth) / 2)
      }
    }
    window.addEventListener('resize', measureLeftPadding)
    measureLeftPadding()
    return () => {
      window.removeEventListener('resize', measureLeftPadding)
    }
  }, [])

  const active = matchPath(router.asPath)
  const hasExpandedRef = useRef(expanded)
  const [colorScheme] = useColorContext()
  const [colorSchemeKey, setColorSchemeKey] = useColorSchemeKey()

  if (expanded) {
    hasExpandedRef.current = true
  }
  return (
    <>
      <Center {...css(styles.container, { color: colorScheme.text })} id='nav'>
        <div ref={containerRef}>
          {hasExpandedRef.current && (
            <>
              <div>
                Colors:{' '}
                {[undefined, 'light', 'dark'].map(key => (
                  <Fragment key={key || 'auto'}>
                    <button onClick={() => setColorSchemeKey(key)}>
                      {key || 'auto'}
                    </button>{' '}
                  </Fragment>
                ))}
              </div>
              {!me && (
                <>
                  <div {...styles.signInBlock}>
                    <SignIn style={{ padding: 0 }} />
                  </div>
                </>
              )}
              {!me?.activeMembership && !inNativeIOSApp && (
                <Link route='pledge' passHref>
                  <Button style={{ marginTop: 24, marginBottom: 24 }} block>
                    {t('nav/becomemember')}
                  </Button>
                </Link>
              )}
              {me && (
                <>
                  <NavLink
                    route='subscriptions'
                    passHref
                    closeHandler={closeHandler}
                    large
                  >
                    {t('pages/notifications/title')}
                  </NavLink>
                  {expanded ? (
                    <NotificationFeedMini closeHandler={closeHandler} />
                  ) : (
                    <Loader loading />
                  )}
                  <div style={{ marginTop: 24 }}>
                    <NavLink
                      route='bookmarks'
                      passHref
                      closeHandler={closeHandler}
                      large
                    >
                      {`${t('nav/bookmarks')}`}
                    </NavLink>
                  </div>
                  <div {...styles.bookmarkContainer}>
                    {expanded ? (
                      <BookmarkMiniFeed
                        style={{
                          marginTop: 10,
                          paddingLeft: containerPadding - 16
                        }}
                        closeHandler={closeHandler}
                      />
                    ) : (
                      <Loader loading />
                    )}
                  </div>
                  <div {...styles.navSection}>
                    <div {...styles.navLinks}>
                      <NavLink
                        route='account'
                        active={active}
                        large
                        closeHandler={closeHandler}
                      >
                        {t('Frame/Popover/myaccount')}
                      </NavLink>
                      <NavLink
                        route='profile'
                        params={{ slug: me.username || me.id }}
                        active={active}
                        large
                        closeHandler={closeHandler}
                      >
                        {t('Frame/Popover/myprofile')}
                      </NavLink>
                    </div>
                  </div>
                  <hr
                    {...css(styles.hr, {
                      color: colorScheme.divider,
                      backgroundColor: colorScheme.divider
                    })}
                  />
                  <div {...styles.navSection}>
                    <div {...styles.navLinks}>
                      {me.accessCampaigns.length > 0 && (
                        <NavLink
                          route='access'
                          active={active}
                          closeHandler={closeHandler}
                          large
                        >
                          {t('nav/share')}
                        </NavLink>
                      )}
                      {!inNativeIOSApp && (
                        <NavLink
                          route='pledge'
                          params={{ group: 'GIVE' }}
                          active={active}
                          closeHandler={closeHandler}
                          large
                        >
                          {t('nav/give')}
                        </NavLink>
                      )}
                      <NavLink
                        {...fontStyles.sansSerifLight16}
                        route='pledge'
                        params={{ package: 'DONATE' }}
                        active={active}
                        closeHandler={closeHandler}
                        large
                      >
                        {t('nav/donate')}
                      </NavLink>
                    </div>
                  </div>
                  <div {...styles.navSection}>
                    <div {...styles.navLinks} {...styles.smallLinks}>
                      <SignOut Link={SignoutLink} />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Center>
      {inNativeApp && hasExpandedRef.current && <Footer />}
    </>
  )
}

const styles = {
  container: css({
    [mediaQueries.mUp]: {
      marginTop: '40px'
    }
  }),
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    height: 1,
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
    display: 'block'
  }),
  bookmarkContainer: css({
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw'
  }),
  navSection: css({
    display: 'flex',
    flexDirection: 'column',
    margin: '24px 0px'
  }),
  navLinks: css({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    }
  }),
  smallLinks: css({
    '& a': {
      ...fontStyles.sansSerifRegular18
    }
  })
}

export default compose(withT, withInNativeApp, withMembership)(UserNav)
