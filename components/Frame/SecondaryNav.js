import React from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { colors, mediaQueries, fontStyles } from '@project-r/styleguide'

import { matchPath } from '../../lib/routes'
import withT from '../../lib/withT'
import NavLink from './Popover/NavLink'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT_MOBILE,
  ZINDEX_HEADER
} from '../constants'

const sections = [
  {
    title: 'Briefings',
    path: '/briefings',
    color: '#07809a',
    kind: 'editorial'
  },
  {
    title: 'Kolumnen',
    path: '/kolumnen',
    color: '#D2933C',
    kind: null
  },
  {
    title: 'Formate',
    path: '/formate',
    color: '#d44438',
    kind: 'scribble'
  },
  {
    title: 'Audio',
    path: '/audio',
    color: null,
    kind: null
  },
  {
    title: 'Serien',
    path: '/serien',
    color: null,
    kind: null
  }
]

export const SecondaryNav = ({
  secondaryNav,
  dark,
  showSecondary,
  router,
  hasOverviewNav,
  t
}) => {
  const active = matchPath(router.asPath)
  return (
    <>
      {hasOverviewNav ? (
        <div
          {...styles.miniNav}
          style={{
            backgroundColor: dark ? colors.negative.primaryBg : '#fff',
            borderBottom: `1px solid ${
              dark ? colors.negative.divider : colors.divider
            }`
          }}
        >
          <NavLink dark={dark} route='index' active={active} minifeed={true}>
            {t('navbar/front')}
          </NavLink>
          <NavLink
            dark={dark}
            prefetch
            route='feed'
            active={active}
            minifeed={true}
          >
            {t('navbar/feed')}
          </NavLink>
          <NavLink
            dark={dark}
            route='discussion'
            active={active}
            hoverColor={colors.primary}
            minifeed={true}
          >
            {t('navbar/discussion')}
          </NavLink>
          {sections.map(section => {
            const match = matchPath(section.path)
            const color = section.color || colors[section.kind]
            return (
              <NavLink
                key={section.title}
                route={match.route}
                params={match.params}
                active={active}
                hoverColor={color}
                minifeed={true}
                dark={dark}
              >
                {section.title}
              </NavLink>
            )
          })}
        </div>
      ) : (
        secondaryNav && (
          <div
            {...styles.secondaryNav}
            style={{
              opacity: showSecondary ? 1 : 0,
              transition: 'opacity 0.2s ease-out',
              backgroundColor: dark ? colors.negative.primaryBg : '#fff',
              borderBottom: `1px solid ${
                dark ? colors.negative.divider : colors.divider
              }`
            }}
          >
            {secondaryNav}
          </div>
        )
      )}
    </>
  )
}

const styles = {
  secondaryNav: css({
    position: 'absolute',
    zIndex: ZINDEX_HEADER,
    top: HEADER_HEIGHT_MOBILE,
    left: 0,
    right: 0,
    height: SUBHEADER_HEIGHT_MOBILE,
    display: 'flex',
    justifyContent: 'flex-start',
    padding: `0px ${Math.floor((HEADER_HEIGHT_MOBILE - 26) / 2)}px`,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT,
      justifyContent: 'center',
      padding: `0px ${Math.floor((HEADER_HEIGHT - 26) / 2)}px`
    }
  }),
  miniNav: css({
    position: 'absolute',
    overflowY: 'hidden',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    zIndex: ZINDEX_HEADER,
    top: HEADER_HEIGHT_MOBILE,
    height: SUBHEADER_HEIGHT_MOBILE,
    left: 0,
    right: 0,
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none' /* Firefox */,
    msOverflowStyle: 'none' /* IE 10+ */,
    '::-webkit-scrollbar': {
      height: 0,
      background: 'transparent'
    },
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT,
      textAlign: 'center'
    },
    '& a': {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      fontSize: 14,
      margin: '8px 16px 0px 16px',
      ':active': fontStyles.sansSerifMedium,
      ':last-child': {
        paddingRight: 16,
        [mediaQueries.mUp]: {
          paddingRight: 0
        }
      }
    }
  }),
  linkItem: css({
    height: SUBHEADER_HEIGHT_MOBILE
  })
}

export default compose(withT)(SecondaryNav)
