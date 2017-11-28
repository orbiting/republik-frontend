import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { compose } from 'redux'
import Loader from '../../components/Loader'
import { css } from 'glamor'
import { Link } from '../../lib/routes'
import { timeFormat } from '../../lib/utils/format'

import {
  Center,
  TeaserFeed,
  TeaserFeedHeadline,
  TeaserFeedLead,
  TeaserFeedCredit
} from '@project-r/styleguide'

const styles = {
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

const getDocuments = gql`
  query getDocuments {
    documents {
      content
      meta {
        title
        description
        publishDate
        slug
      }
    }
  }
`

const publishDateFormat = timeFormat('%d. %B %Y')
const urlDateFormat = timeFormat('%Y/%m/%d')

const getArticleRoute = (dateStr, slug) => {
  // TODO: Retrieve from backend.
  const date = new Date(dateStr)
  return `/${urlDateFormat(date)}/${slug}`
}

const Teaser = ({ doc }) => {
  // TODO: Pipe article format and teaser type through meta.
  const format = doc.meta.format || ''
  const teaserType = doc.meta.type || '' // 'editorial', 'social', 'meta'
  return (
    <TeaserFeed key={doc.meta.slug} format={format} type={teaserType}>
      <TeaserFeedHeadline.Editorial>
        <Link route={getArticleRoute(doc.meta.publishDate, doc.meta.slug)}>
          <a {...styles.link}>{doc.meta.title}</a>
        </Link>
      </TeaserFeedHeadline.Editorial>
      <TeaserFeedLead>{doc.meta.description}</TeaserFeedLead>
      <TeaserFeedCredit>
        {publishDateFormat(new Date(doc.meta.publishDate))}
      </TeaserFeedCredit>
    </TeaserFeed>
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
            <Center>
              {documents && documents.map(doc => <Teaser doc={doc} />)}
            </Center>
          )
        }}
      />
    )
  }
}

export default compose(graphql(getDocuments))(Feed)
