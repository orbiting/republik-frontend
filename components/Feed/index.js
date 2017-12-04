import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import { Link } from '../../lib/routes'

import {
  Center,
  TeaserFeed
} from '@project-r/styleguide'

const getDocuments = gql`
  query getDocuments {
    documents {
      content
      meta {
        kind
        format
        credits
        title
        description
        publishDate
        slug
      }
    }
  }
`

const getArticleParams = path => {
  const [year, month, day, slug] = path.split('/')
  return {
    year,
    month,
    day,
    slug
  }
}

const ArticleLink = ({ slug, children }) => {
  const params = getArticleParams(slug)
  // safety check for now
  if (!params.slug) {
    return children
  }
  return (
    <Link route='article' params={params}>
      {children}
    </Link>
  )
}

class Feed extends Component {
  // This will become a stateful component eventually.
  render () {
    const { data: { loading, error, documents } } = this.props
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          return (
            <Center style={{padding: '80px 0 120px'}}>
              {documents &&
                documents.map(doc => (
                  <TeaserFeed {...doc.meta} Link={ArticleLink} key={doc.meta.slug} />
                ))}
            </Center>
          )
        }}
      />
    )
  }
}

export default compose(graphql(getDocuments))(Feed)
