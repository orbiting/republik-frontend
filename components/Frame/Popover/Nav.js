import React, { useRef } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import {
  colors,
  mediaQueries,
  Center,
  Button,
  useColorContext
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import withT from '../../../lib/withT'
import withInNativeApp from '../../../lib/withInNativeApp'
import { Link, matchPath } from '../../../lib/routes'
import SignIn from '../../Auth/SignIn'
import { withMembership } from '../../Auth/checkRoles'
import Footer from '../Footer'
import SearchForm from '../../Search/Form'
import NavLink from './NavLink'
import Sections from './Sections'

const Nav = ({
  me,
  router,
  expanded,
  closeHandler,
  t,
  inNativeApp,
  inIOS,
  inNativeIOSApp,
  isMember,
  onSearchSubmit
}) => {
  const [colorScheme] = useColorContext()
  const active = matchPath(router.asPath)
  const hasExpandedRef = useRef(expanded)
  if (expanded) {
    hasExpandedRef.current = true
  }
  return (
    <>
      <Center {...styles.container} id='nav'>
        {hasExpandedRef.current && (
          <>
            {!me && (
              <>
                <div {...styles.signInBlock}>
                  <SignIn style={{ padding: 0 }} />
                </div>
              </>
            )}
            {!me?.activeMembership && !inNativeIOSApp && (
              <Link route='pledge' passHref>
                <Button style={{ marginTop: 24 }} block>
                  {t('nav/becomemember')}
                </Button>
              </Link>
            )}
            {me && (
              <SearchForm noInitialFocus onSearchSubmit={onSearchSubmit} />
            )}
            <div {...styles.navSection}>
              <div {...styles.navLinks}>
                {isMember && (
                  <>
                    <NavLink
                      large
                      route='index'
                      active={active}
                      closeHandler={closeHandler}
                    >
                      {t('navbar/front')}
                    </NavLink>
                    <NavLink
                      prefetch
                      large
                      route='feed'
                      active={active}
                      closeHandler={closeHandler}
                    >
                      {t('navbar/feed')}
                    </NavLink>
                  </>
                )}
                <NavLink
                  large
                  route='discussion'
                  title={t('navbar/discussion')}
                  active={active}
                  closeHandler={closeHandler}
                  formatColor={colors.primary}
                >
                  {t('navbar/discussion')}
                </NavLink>
              </div>
            </div>
            <hr
              {...styles.hr}
              {...colorScheme.set('color', 'divider')}
              {...colorScheme.set('backgroundColor', 'divider')}
            />
            <div {...styles.navSection}>
              <Sections active={active} vertical closeHandler={closeHandler} />
              <NavLink
                route='sections'
                title={t('navbar/sections')}
                active={active}
                closeHandler={closeHandler}
                formatColor={colors.primary}
              >
                {t('navbar/sections')}
              </NavLink>
            </div>
            <hr {...styles.hr} />
            <div {...styles.navSection}>
              <div {...styles.navLinks}>
                <NavLink
                  inline
                  large
                  route='cockpit'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/cockpit')}
                </NavLink>
                <NavLink
                  large
                  route='events'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/events')}
                </NavLink>
                <NavLink
                  large
                  route='legal/imprint'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/team')}
                </NavLink>
              </div>
            </div>
            <div {...styles.navSection}>
              <div
                {...styles.navLinks}
                style={{
                  // ensures last item is visible in iOS safari
                  marginBottom: inIOS && !inNativeApp ? 64 : 24
                }}
              >
                <NavLink
                  large
                  route='vote/nov20'
                  active={active}
                  closeHandler={closeHandler}
                >
                  Urbastimmung
                </NavLink>
              </div>
            </div>
          </>
        )}
      </Center>
      {inNativeApp && hasExpandedRef.current && <Footer />}
    </>
  )
}

const styles = {
  container: css({
    [mediaQueries.mUp]: {
      marginTop: '40px',
      marginBottom: '40px'
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
    top: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT
    }
  }),
  signInBlock: css({
    display: 'block'
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
  })
}

export default compose(withT, withInNativeApp, withMembership)(Nav)
