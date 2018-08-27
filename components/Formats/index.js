import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import { keys, nest, values } from 'd3-collection'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import withT from '../../lib/withT'

import FormatTag from './FormatTag'
import Latest from './Latest'

import {
  Center,
  Interaction,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '30px 15px 120px',
    [mediaQueries.mUp]: {
      maxWidth: '695px',
      padding: '60px 0 120px'
    }
  }),
  latest: css({
    margin: '60px 0 20px 0',
    [mediaQueries.mUp]: {
      margin: '100px 0 40px 0'
    }
  }),
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

class Formats extends Component {
  render () {
    const { data: { loading, error, documents }, t } = this.props
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          const sections = nest()
            .key(d => d['meta']['kind'])
            .object(documents.nodes)

          return (
            <Center {...styles.container}>
              {keys(sections).map(sectionKey => <Fragment>
                {sections[sectionKey].length > 0 && (
                  <section {...styles.section} key={sectionKey}>
                    <h2 {...styles.h2}>
                      {t(`formats/title/${sectionKey}`)}
                    </h2>
                    {values(sections[sectionKey]).map(doc => (
                      <FormatTag
                        color={getColorFromMeta(doc.meta)}
                        path={doc.meta.path}
                        label={doc.meta.title}
                        count={doc.linkedDocuments.totalCount}
                        key={doc.meta.path} />
                    ))}
                  </section>)
                }
              </Fragment>)}
              <Interaction.H2 {...styles.latest}>
                {t('formats/latest')}
              </Interaction.H2>
              <Latest />
            </Center>
          )
        }}
      />
    )
  }
}

export default compose(withT, graphql(getFormats))(Formats)
