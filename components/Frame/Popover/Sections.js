import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { ascending } from 'd3-array'
import { css } from 'glamor'
import { nest } from 'd3-collection'
import gql from 'graphql-tag'

import { Loader, mediaQueries, colors } from '@project-r/styleguide'

import { matchPath } from '../../../lib/routes'

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
      }
    }
  }
`

const SectionNav = ({
  data: { loading, error, sections },
  active,
  closeHandler,
  minifeed,
  dark
}) => {
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
              sections.nodes.map(({ id, meta }, i) => {
                const match = matchPath(meta.path)
                if (!match) {
                  return null
                }
                const color = meta.color || colors[meta.kind]
                return (
                  <Fragment key={id}>
                    {i > 0 && <br />}
                    <NavLink
                      dark={dark}
                      route={match.route}
                      params={match.params}
                      active={active}
                      closeHandler={closeHandler}
                      hoverColor={color}
                      inline
                      minifeed={minifeed}
                    >
                      {meta.title}
                    </NavLink>
                  </Fragment>
                )
              })}
          </>
        )
      }}
    />
  )
}

export default compose(graphql(getSectionNav))(SectionNav)
