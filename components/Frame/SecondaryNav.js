import React from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { colors, mediaQueries } from '@project-r/styleguide'

import { matchPath } from '../../lib/routes'
import withT from '../../lib/withT'
import NavLink from './Popover/NavLink'
import Link from '../Link/Path'
import Sections from '../Frame/Popover/Sections'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT,
  SUBHEADER_HEIGHT_MOBILE,
  ZINDEX_HEADER
} from '../constants'

export const SecondaryNav = ({
  secondaryNav,
  dark,
  isFront,
  showSecondary,
  router,
  hasOverviewNav,
  t
}) => {
  const active = matchPath(router.asPath)
  console.log(active)
  return (
    <>
      {isFront || hasOverviewNav ? (
        <div
          {...styles.miniNav}
          style={{
            backgroundColor: dark ? colors.negative.primaryBg : '#fff'
          }}
        >
          <div {...styles.navContainer}>
            <NavLink route='index' active={active} minifeed={true}>
              {t('navbar/front')}
            </NavLink>
            <NavLink prefetch route='feed' active={active} minifeed={true}>
              {t('navbar/feed')}
            </NavLink>
            <NavLink
              route='discussion'
              active={active}
              hoverColor={colors.primary}
              minifeed={true}
            >
              {t('navbar/discussion')}
            </NavLink>
            <Sections active={active} minifeed={true} />
          </div>
        </div>
      ) : (
        secondaryNav && (
          <div
            {...styles.secondaryNav}
            style={{
              backgroundColor: dark ? colors.negative.primaryBg : '#fff'
            }}
          >
            {showSecondary && secondaryNav}
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
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${colors.divider}`,
    padding: `0px ${Math.floor((HEADER_HEIGHT_MOBILE - 26) / 2)}px`,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT,
      padding: `0px ${Math.floor((HEADER_HEIGHT - 26) / 2)}px`
    }
  }),
  miniNav: css({
    position: 'absolute',
    zIndex: ZINDEX_HEADER,
    top: HEADER_HEIGHT_MOBILE,
    height: SUBHEADER_HEIGHT_MOBILE,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    borderBottom: `1px solid ${colors.divider}`,
    [mediaQueries.mUp]: {
      top: HEADER_HEIGHT,
      justifyContent: 'center'
    },
    '& a': {
      display: 'block',
      fontSize: 14,
      margin: '0 16px',
      ':active': {
        fontWeight: 'bold'
      },
      ':last-child': {
        paddingRight: 16,
        [mediaQueries.mUp]: {
          paddingRight: 0
        }
      }
    }
  }),
  navContainer: css({
    position: 'absolute',
    top: 8,
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    overflowX: 'scroll',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none' /* Firefox */,
    msOverflowStyle: 'none' /* IE 10+ */,
    '::-webkit-scrollbar': {
      width: 0,
      background: 'transparent'
    },
    [mediaQueries.mUp]: {
      justifyContent: 'center'
    }
  }),
  linkItem: css({
    height: SUBHEADER_HEIGHT_MOBILE
  })
}

export default compose(withT)(SecondaryNav)
