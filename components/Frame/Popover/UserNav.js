import React, { useRef, useEffect, useState } from 'react'
import { compose, graphql } from 'react-apollo'
import { css } from 'glamor'
import {
  colors,
  fontStyles,
  mediaQueries,
  Center,
  Button,
  TeaserSectionTitle
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import withT from '../../../lib/withT'
import withInNativeApp from '../../../lib/withInNativeApp'
import { matchPath } from '../../../lib/routes'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { withMembership } from '../../Auth/checkRoles'
import Footer from '../Footer'
import NavLink, { NavA } from './NavLink'
import NotificationFeedMini from '../../Notifications/NotificationFeedMini'
import Link from '../../Link/Href'
import BookmarkMiniFeed from '../../Bookmarks/BookmarkMiniFeed'

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
  if (expanded) {
    hasExpandedRef.current = true
  }
  return (
    <>
      <hr {...styles.hr} {...styles.hrFixed} />
      <Center {...styles.container} id='nav'>
        <div ref={containerRef}>
          {hasExpandedRef.current && (
            <>
              {!me && (
                <>
                  <div {...styles.signInBlock}>
                    <SignIn style={{ padding: 0 }} />
                  </div>
                </>
              )}
              {!isMember && (
                <Button
                  style={{ marginTop: 24 }}
                  href='https://www.republik.ch/pledge'
                  black
                  block
                >
                  {t('nav/becomemember')}
                </Button>
              )}
              {me && (
                <>
                  <Link
                    href='/benachrichtigungen'
                    active={active}
                    closeHandler={closeHandler}
                    passHref
                  >
                    <TeaserSectionTitle small>
                      {t('pages/notifications/title')}
                    </TeaserSectionTitle>
                  </Link>
                  <NotificationFeedMini closeHandler={closeHandler} />
                  <br />
                  <Link
                    href='/lesezeichen'
                    active={active}
                    closeHandler={closeHandler}
                    passHref
                  >
                    <TeaserSectionTitle small>
                      {`${t('nav/bookmarks')}`}
                    </TeaserSectionTitle>
                  </Link>
                  <div {...styles.bookmarkContainer}>
                    <BookmarkMiniFeed
                      style={{
                        marginTop: 10,
                        paddingLeft: containerPadding - 16
                      }}
                      closeHandler={closeHandler}
                    />
                  </div>
                  <div {...styles.navSection}>
                    <div {...styles.navLinks}>
                      <NavLink
                        route='account'
                        active={active}
                        closeHandler={closeHandler}
                      >
                        {t('Frame/Popover/myaccount')}
                      </NavLink>
                      <NavLink
                        route='profile'
                        params={{ slug: me.username || me.id }}
                        active={active}
                        closeHandler={closeHandler}
                      >
                        {t('Frame/Popover/myprofile')}
                      </NavLink>
                    </div>
                  </div>
                  <div {...styles.navSection}>
                    <div {...styles.navLinks} {...styles.regularLinks}>
                      {me.accessCampaigns.length > 0 && (
                        <NavLink
                          route='access'
                          active={active}
                          closeHandler={closeHandler}
                        >
                          {t('nav/share')}
                        </NavLink>
                      )}
                      <NavLink
                        route='pledge'
                        params={{ group: 'GIVE' }}
                        active={active}
                        closeHandler={closeHandler}
                      >
                        {t('nav/give')}
                      </NavLink>
                      <NavLink
                        {...fontStyles.sansSerifLight16}
                        route='pledge'
                        params={{ package: 'DONATE' }}
                        active={active}
                        closeHandler={closeHandler}
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
          {inNativeApp && hasExpandedRef.current && <Footer />}
        </div>
      </Center>
    </>
  )
}

const styles = {
  container: css({
    color: colors.text,
    [mediaQueries.mUp]: {
      marginTop: '40px'
    }
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
    },
    '& a': {
      flexShrink: 0,
      ...fontStyles.sansSerifMedium20,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifMedium22,
        marginRight: 36
      }
    },
    '& a:not(:last-child)': {
      marginBottom: 24,
      [mediaQueries.mUp]: {
        marginBottom: 0
      }
    }
  }),
  regularLinks: css({
    '& a': {
      ...fontStyles.sansSerifRegular,
      fontSize: 20,
      lineHeight: '24px',
      letterSpacing: 'normal',
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular22
      }
    }
  }),
  smallLinks: css({
    '& a': {
      ...fontStyles.sansSerifRegular18
    }
  })
}

export default compose(withT, withInNativeApp, withMembership)(UserNav)
