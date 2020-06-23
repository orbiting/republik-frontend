import React, { useRef } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import {
  colors,
  fontStyles,
  mediaQueries,
  Label,
  Center,
  Button,
  TeaserSectionTitle
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'

import withT from '../../../lib/withT'
import withInNativeApp from '../../../lib/withInNativeApp'
import { matchPath } from '../../../lib/routes'
import SignIn from '../../Auth/SignIn'
import { withMembership } from '../../Auth/checkRoles'
import Footer from '../Footer'
import SearchForm from '../../Search/Form'
import Link from '../../Link/Href'
import NavLink, { NavA } from './NavLink'
import Sections from './Sections'

const Nav = ({
  me,
  router,
  expanded,
  closeHandler,
  children,
  t,
  inNativeApp,
  inNativeIOSApp,
  isMember,
  onSearchSubmit
}) => {
  const active = matchPath(router.asPath)
  const hasExpandedRef = useRef(expanded)
  if (expanded) {
    hasExpandedRef.current = true
  }
  return (
    <>
      <hr {...styles.hr} {...styles.hrFixed} />
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
              <SearchForm
                style={{ padding: 0 }}
                reduced
                onSearchSubmit={onSearchSubmit}
              />
            )}
            <div {...styles.navSection}>
              <div {...styles.navLinks}>
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
                <NavLink
                  route='discussion'
                  active={active}
                  closeHandler={closeHandler}
                  hoverColor={colors.primary}
                >
                  {t('navbar/discussion')}
                </NavLink>
              </div>
            </div>
            <hr {...styles.hr} />
            <div {...styles.navSection}>
              <div style={{ color: colors.lightText }}>
                <Link
                  href='/sections'
                  active={active}
                  closeHandler={closeHandler}
                  passHref
                >
                  <TeaserSectionTitle small>
                    {t('nav/sections')}
                  </TeaserSectionTitle>
                </Link>
              </div>
              <div {...styles.sectionLinks}>
                <Sections vertical />
              </div>
            </div>
            <hr {...styles.hr} />
            <div {...styles.navSection}>
              <div {...styles.navLinks}>
                <NavLink
                  inline
                  route='cockpit'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/cockpit')}
                </NavLink>
                <NavLink
                  route='events'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/events')}
                </NavLink>
                <NavLink
                  route='meta'
                  active={active}
                  closeHandler={closeHandler}
                >
                  {t('nav/meta')}
                </NavLink>
                <NavLink
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
      </Center>
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
  sectionLinks: css({
    marginTop: 0,
    display: 'flex',
    flexWrap: 'wrap',
    '& a': {
      margin: '16px 24px 0px 0px'
    },
    ...fontStyles.sansSerifMedium16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium22
    }
  })
}

export default compose(withT, withInNativeApp, withMembership)(Nav)
