import React, { Fragment, useState } from 'react'
import { withRouter } from 'next/router'
import { css } from 'glamor'
import SeriesNavPanel from './SeriesNavPanel'
import { cleanAsPath } from '../../lib/routes'
import { imageResizeUrl } from 'mdast-react-render/lib/utils'

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

import {
  mediaQueries,
  fontFamilies,
  useColorContext,
  colors,
  useBodyScrollLock,
  useHeaderHeight,
  plainButtonRule
} from '@project-r/styleguide'

const styles = {
  button: css(plainButtonRule, {
    fontFamily: fontFamilies.sansSerifRegular,
    padding: 0,
    textAlign: 'left',
    top: 0,
    whiteSpace: 'nowrap'
  }),
  menu: css({
    backgroundColor: colors.negative.primaryBg,
    color: colors.negative.text,
    fontFamily: fontFamilies.sansSerifRegular,
    position: 'fixed',
    visibility: 'hidden',
    whiteSpace: 'normal',
    opacity: 0,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
    '&[aria-expanded=true]': {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.2s ease-in-out'
    },
    display: 'flex',
    boxSizing: 'border-box',
    left: 0,
    width: '100vw',
    flexDirection: 'column',
    padding: 0
  }),
  title: css({
    fontSize: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    paddingRight: '30px',
    position: 'relative',
    textOverflow: 'ellipsis',
    [mediaQueries.mUp]: {
      fontSize: 18
    }
  }),
  logo: css({
    height: 24,
    marginRight: 6
  })
}

const SeriesNavButton = ({ t, series, router }) => {
  const [colorScheme] = useColorContext()
  const [expanded, setExpanded] = useState(false)
  const [ref] = useBodyScrollLock(expanded)
  const [headerHeight] = useHeaderHeight()

  const episodes = series && series.episodes
  const currentPath = cleanAsPath(router.asPath)
  const currentEpisode = episodes.find(
    episode => episode.document && episode.document.meta.path === currentPath
  )

  return (
    <Fragment>
      <button
        {...styles.button}
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        <span {...styles.title}>
          {series.logo && (
            <>
              <img
                {...styles.logo}
                src={imageResizeUrl(series.logo, 'x48')}
                {...colorScheme.set(
                  'display',
                  series.logoDark ? 'displayLight' : 'block'
                )}
              />
              {series.logoDark && (
                <img
                  {...styles.logo}
                  src={imageResizeUrl(series.logoDark, 'x48')}
                  {...colorScheme.set('display', 'displayDark')}
                />
              )}
            </>
          )}
          {series.title}
          {currentEpisode &&
            (series.title.match(/\?$/)
              ? ` ${currentEpisode.label}`
              : ` – ${currentEpisode.label}`)}
          <span>
            {expanded && (
              <MdKeyboardArrowUp
                size='28'
                {...colorScheme.set('fill', 'text')}
              />
            )}
            {!expanded && (
              <MdKeyboardArrowDown
                size='28'
                {...colorScheme.set('fill', 'text')}
              />
            )}
          </span>
        </span>
      </button>
      <div
        style={{
          top: headerHeight,
          height: `calc(100vh - ${headerHeight}px)`
        }}
        {...styles.menu}
        aria-expanded={expanded}
        ref={ref}
      >
        <SeriesNavPanel
          t={t}
          series={series}
          onClick={() => {
            setExpanded(false)
          }}
        />
      </div>
    </Fragment>
  )
}

export default withRouter(SeriesNavButton)
