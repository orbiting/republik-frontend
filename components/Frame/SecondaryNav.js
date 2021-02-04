import React from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import {
  colors,
  mediaQueries,
  fontStyles,
  useColorContext
} from '@project-r/styleguide'

import { matchPath } from '../../lib/routes'
import withT from '../../lib/withT'
import NavLink from './Popover/NavLink'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  SUBHEADER_HEIGHT,
  ZINDEX_HEADER
} from '../constants'

const sections = [
  {
    title: 'Meta',
    path: '/meta',
    color: '#000',
    kind: null
  },
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
  router,
  hasOverviewNav,
  isSecondarySticky,
  t
}) => {
  const [colorScheme] = useColorContext()
  const active = matchPath(router.asPath)
  return (
    <>
      {hasOverviewNav ? (
        <div
          {...styles.miniNav}
          {...colorScheme.set('backgroundColor', 'default')}
          {...colorScheme.set('borderColor', 'divider')}
          onTouchStart={e => {
            // prevent touchstart from bubbling to Pullable
            e.stopPropagation()
          }}
          style={{
            borderTopWidth: isSecondarySticky ? 0 : 1,
            borderTopStyle: 'solid'
          }}
        >
          <NavLink
            route='index'
            active={active}
            minifeed
            title={t('navbar/front')}
          >
            {t('navbar/front')}
          </NavLink>
          <NavLink
            prefetch
            route='feed'
            active={active}
            minifeed
            title={t('navbar/feed')}
          >
            {t('navbar/feed')}
          </NavLink>
          <NavLink
            route='discussion'
            active={active}
            formatColor={colors.primary}
            minifeed
            title={t('navbar/discussion')}
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
                formatColor={color}
                minifeed
                title={section.title}
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
            {...colorScheme.set('color', 'text')}
            {...colorScheme.set('borderColor', 'divider')}
            {...colorScheme.set('backgroundColor', 'default')}
            style={{
              borderTopWidth: isSecondarySticky ? 0 : 1,
              borderTopStyle: 'solid',
              transition: 'opacity 0.2s ease-out'
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
    zIndex: ZINDEX_HEADER,
    left: 0,
    right: 0,
    height: SUBHEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'flex-start',
    padding: `0px 15px`,
    [mediaQueries.mUp]: {
      justifyContent: 'center'
    }
  }),
  miniNav: css({
    overflowY: 'hidden',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    zIndex: ZINDEX_HEADER,
    height: SUBHEADER_HEIGHT,
    left: 0,
    right: 0,
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none' /* Firefox */,
    msOverflowStyle: 'none' /* IE 10+ */,
    '::-webkit-scrollbar': {
      display: 'none'
    },
    [mediaQueries.mUp]: {
      textAlign: 'center'
    },
    '& a': {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      fontSize: 14,
      margin: '12px 15px 0px 15px',
      '::after': {
        ...fontStyles.sansSerifMedium,
        display: 'block',
        content: 'attr(title)',
        height: 0,
        overflow: 'hidden',
        visibility: 'hidden'
      },
      ':last-child': {
        paddingRight: 16,
        [mediaQueries.mUp]: {
          paddingRight: 0
        }
      },
      '&.is-active': {
        ...fontStyles.sansSerifMedium,
        lineHeight: '16px',
        marginTop: -1
      }
    },
    '@media print': {
      display: 'none'
    }
  }),
  linkItem: css({
    height: SUBHEADER_HEIGHT
  })
}

export default compose(withT)(SecondaryNav)
