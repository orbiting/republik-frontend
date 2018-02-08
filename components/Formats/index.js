import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import { descending } from 'd3-array'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import Link from '../Link/Href'
import withT from '../../lib/withT'

import {
  Center,
  TeaserFeed,
  Editorial,
  Interaction,
  RawHtml,
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
  h1: css({
    marginBottom: '20px',
    [mediaQueries.mUp]: {
      marginBottom: '40px'
    }
  }),
  h2: css({
    marginBottom: '20px',
    [mediaQueries.mUp]: {
      marginBottom: '30px'
    }
  })
}

const getFormats = gql`
  query getFormats {
    documents(template: "format", feed: true) {
      nodes {
        meta {
          kind
          title
          description
          path
          color
          publishDate
        }
      }
    }
  }
`

class Formats extends Component {
  render() {
    const { data: { loading, error, documents }, t } = this.props
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          const editorialNodes = documents
            ? [...documents.nodes]
                .filter(node => node.meta.kind === 'editorial')
                .sort((a, b) =>
                  descending(a.meta.publishDate, b.meta.publishDate)
                )
            : []
          const metaNodes = documents
            ? [...documents.nodes]
                .filter(node => node.meta.kind === 'meta')
                .sort((a, b) =>
                  descending(a.meta.publishDate, b.meta.publishDate)
                )
            : []
          return (
            <Center {...styles.container}>
              <Interaction.H1 {...styles.h1}>
                {t('formats/title')}
              </Interaction.H1>
              <RawHtml
                type={Editorial.P}
                dangerouslySetInnerHTML={{
                  __html: t('formats/lead')
                }}
              />
              {!!editorialNodes.length && (
                <Fragment>
                  <Interaction.H2 {...styles.h2}>
                    {t('formats/title/editorial')}
                  </Interaction.H2>
                  {editorialNodes.map(doc => (
                    <TeaserFeed {...{...doc.meta, kind: 'meta'}} Link={Link} key={doc.meta.path} />
                  ))}
                </Fragment>
              )}
              {!!metaNodes.length && (
                <Fragment>
                  <Interaction.H2 {...styles.h2}>
                    {t('formats/title/meta')}
                  </Interaction.H2>
                  {metaNodes.map(doc => (
                    <TeaserFeed {...doc.meta} Link={Link} key={doc.meta.path} />
                  ))}
                </Fragment>
              )}
            </Center>
          )
        }}
      />
    )
  }
}

export default compose(withT, graphql(getFormats))(Formats)
