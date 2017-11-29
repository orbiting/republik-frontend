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

const Teaser = ({ meta }) => {
  // TODO: Pipe article format and teaser type through meta.
  return (
    <TeaserFeed key={meta.slug} format={meta.format} type={meta.type}>
      <TeaserFeedHeadline.Editorial>
        <Link route={getArticleRoute(meta.publishDate, meta.slug)}>
          <a {...styles.link}>{meta.title}</a>
        </Link>
      </TeaserFeedHeadline.Editorial>
      <TeaserFeedLead>{meta.description}</TeaserFeedLead>
      <TeaserFeedCredit>
        {publishDateFormat(new Date(meta.publishDate))}
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
              {documents && documents.map(doc => <Teaser meta={doc.meta} />)}
            </Center>
          )
        }}
      />
    )
  }
}

export default compose(graphql(getDocuments))(Feed)
