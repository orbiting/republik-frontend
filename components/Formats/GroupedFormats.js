import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { ascending } from 'd3-array'
import { css } from 'glamor'
import { nest } from 'd3-collection'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import withT from '../../lib/withT'

import FormatTag from './FormatTag'

import {
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  h2: css({
    ...fontStyles.sansSerifRegular13,
    color: '#979797',
    margin: '0 0 15px 0',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16,
      margin: '12px 0 15px 0'
    }
  }),
  section: css({
    marginBottom: '25px',
    [mediaQueries.mUp]: {
      marginBottom: '30px',
      '& + &': {
        borderTop: `1px solid ${colors.divider}`
      }
    }
  })
}

const getFormats = gql`
  query getFormats {
    documents(template: "format", feed: true) {
      nodes {
        meta {
          template
          kind
          title
          description
          path
          color
          publishDate
        }
        linkedDocuments {
          totalCount
        }
      }
    }
  }
`

const getColorFromMeta = meta => {
  const formatMeta = meta.format && meta.format.meta
  const color = meta.color || (formatMeta && formatMeta.color)
  const kind = meta.kind || (formatMeta && formatMeta.kind)
  return color || colors[kind]
}

class GroupedFormats extends Component {
  render () {
    const { data: { loading, error, documents }, t } = this.props
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          const sections = nest()
            .key(d => d['meta']['kind'])
            .sortValues((a, b) => ascending(a.meta.title, b.meta.title))
            .entries(documents.nodes)
            .filter(d => d.values.length)

          return (
            <Fragment>
              {sections.map(({key, values}) => (
                <section {...styles.section} key={key}>
                  <h2 {...styles.h2}>
                    {t(`formats/title/${key}`)}
                  </h2>
                  {values.map(doc => (
                    <FormatTag
                      color={getColorFromMeta(doc.meta)}
                      path={doc.meta.path}
                      label={doc.meta.title}
                      count={doc.linkedDocuments.totalCount}
                      key={doc.meta.path} />
                  ))}
                </section>
              ))}
            </Fragment>
          )
        }}
      />
    )
  }
}

export default compose(withT, graphql(getFormats))(GroupedFormats)
