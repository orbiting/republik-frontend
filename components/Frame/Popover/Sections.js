import React from 'react'
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
  closeHandler
}) => {
  return (
    <Loader
      loading={loading}
      error={error}
      style={{ minHeight: 90 }}
      render={() => {
        return (
          <>
            {sections.nodes.map(({ id, meta }) => {
              const match = matchPath(meta.path)
              if (!match) {
                return null
              }
              return (
                <NavLink
                  route={match.route}
                  params={match.params}
                  active={active}
                  closeHandler={closeHandler}
                  key={id}
                  style={{
                    color: meta.color || colors[meta.kind]
                  }}
                  inline
                >
                  {meta.title}
                </NavLink>
              )
            })}
          </>
        )
      }}
    />
  )
}

export default compose(graphql(getSectionNav))(SectionNav)
