import React, { useState, useEffect, useRef } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { ascending } from 'd3-array'
import { css } from 'glamor'
import { ChevronRightIcon } from '@project-r/styleguide/icons'

import {
  Loader,
  colors,
  FormatTag,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

import { matchPath } from '../../../lib/routes'
import Link from '../../Link/Href'

import NavLink from './NavLink'

const getSectionNav = gql`
  query getSectionNav {
    sections: documents(template: "section", feed: true) {
      nodes {
        id
        meta {
          title
          path
          color
          kind
        }
        formats: linkedDocuments(feed: true) {
          nodes {
            id
            meta {
              title
              path
              color
              kind
            }
            linkedDocuments(feed: true) {
              totalCount
            }
          }
        }
      }
    }
  }
`

const Panel = ({
  isMobile,
  isActivePanel,
  match,
  dark,
  active,
  closeHandler,
  color,
  meta,
  formats
}) => {
  const panelRef = useRef(null)
  const [panelHeight, setPanelHeight] = useState()
  useEffect(() => {
    const measure = () => {
      setPanelHeight(panelRef.current.scrollHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
    }
  }, [])
  return (
    <div
      ref={panelRef}
      style={
        isMobile
          ? {
              height: isActivePanel ? `${panelHeight}px` : 0,
              opacity: isActivePanel ? 1 : 0
            }
          : {}
      }
      {...styles.accordionBody}
    >
      {!isMobile && (
        <div {...styles.sectionLink}>
          <NavLink
            dark={dark}
            route={match.route}
            params={match.params}
            active={active}
            closeHandler={closeHandler}
            formatColor={color}
            inline
          >
            {meta.title}
          </NavLink>
        </div>
      )}
      {[]
        .concat(formats.nodes)
        .sort((a, b) => ascending(a.meta.title, b.meta.title))
        .map(({ id, meta: formatMeta, linkedDocuments }) => (
          <Link href={formatMeta.path} passHref key={id}>
            <a {...styles.formatLink} onClick={() => closeHandler()}>
              <FormatTag
                color={formatMeta.color || colors[formatMeta.kind]}
                label={formatMeta.title}
                count={linkedDocuments.totalCount || null}
              />
            </a>
          </Link>
        ))}
    </div>
  )
}

const SectionNav = ({
  data: { loading, error, sections },
  active,
  closeHandler,
  dark
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [activePanel, setActivePanel] = useState(null)

  useEffect(() => {
    const measure = () => {
      setIsMobile(window.innerWidth < mediaQueries.mBreakPoint)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <Loader
      delay={1000}
      loading={loading}
      error={error}
      style={{ minHeight: 110 }}
      render={() => {
        return (
          <>
            {sections &&
              sections.nodes.map(({ id, meta, formats }, i) => {
                const match = matchPath(meta.path)
                if (!match) {
                  return null
                }
                const color = meta.color || colors[meta.kind]
                const isActivePanel = activePanel === i
                if (!formats.nodes.length) {
                  // Serien
                  return (
                    <div {...styles.container} key={id}>
                      <div {...styles.sectionLink}>
                        <NavLink
                          dark={dark}
                          route={match.route}
                          params={match.params}
                          active={active}
                          closeHandler={closeHandler}
                          formatColor={color}
                          inline
                        >
                          {meta.title}
                        </NavLink>
                      </div>
                    </div>
                  )
                }
                return (
                  <div {...styles.container} key={id}>
                    {isMobile && (
                      <div
                        {...styles.accordionHead}
                        {...styles.sectionLink}
                        onClick={() => setActivePanel(isActivePanel ? null : i)}
                      >
                        <NavLink
                          dark={dark}
                          route={match.route}
                          params={match.params}
                          active={active}
                          closeHandler={closeHandler}
                          formatColor={color}
                          inline
                        >
                          {meta.title}
                        </NavLink>
                        <ChevronRightIcon
                          size={22}
                          style={{
                            transition: 'transform 0.3s ease-out',
                            transform: isActivePanel
                              ? 'rotate(270deg)'
                              : 'rotate(90deg)'
                          }}
                        />
                      </div>
                    )}
                    <Panel
                      isMobile={isMobile}
                      isActivePanel={isActivePanel}
                      match={match}
                      dark={dark}
                      active={active}
                      closeHandler={closeHandler}
                      color={color}
                      meta={meta}
                      formats={formats}
                    />
                  </div>
                )
              })}
          </>
        )
      }}
    />
  )
}

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 0,
    marginBottom: 24,
    [mediaQueries.mUp]: {
      flexDirection: 'row'
    },
    '& a': {
      ...fontStyles.sansSerifMedium20,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifMedium22
      }
    }
  }),
  formatLink: css({
    color: 'inherit',
    textDecoration: 'none',
    margin: '0',
    '& div': {
      ...fontStyles.sansSerifMedium16,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifMedium20
      }
    }
  }),
  sectionLink: css({
    '& a': {
      margin: '0 20px 5px 0',
      ...fontStyles.sansSerifMedium20,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifMedium22
      }
    }
  }),
  accordionHead: css({
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    [mediaQueries.mUp]: {}
  }),
  accordionBody: css({
    overflow: 'hidden',
    transition: 'height 0.2s ease-out, opacity 0.3s ease-out',
    [mediaQueries.mUp]: {
      overflow: 'initial'
    }
  })
}

export default compose(graphql(getSectionNav))(SectionNav)
