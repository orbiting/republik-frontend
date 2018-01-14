import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from '../../lib/routes'

import Loader from '../Loader'
import Meta from '../Frame/Meta'
import { Content } from '../Frame'

import withT from '../../lib/withT'
import StatusError from '../StatusError'

import {
  NarrowContainer, linkRule
} from '@project-r/styleguide'

import {
  PUBLIC_BASE_URL, STATIC_BASE_URL
} from '../../lib/constants'

import Update from './Detail'

const query = gql`
query {
  updates {
    slug
    title
    text
    metaDescription
    socialMediaImage
    publishedDateTime
  }
}
`

const Overview = compose(
  withT,
  graphql(query, {
    props: ({ data, ownProps: { url: { query: { slug } }, t } }) => {
      const error = data.error
      let update
      if (slug && data.updates && !error) {
        update = data.updates.find(update => (
          update.slug === slug
        )) || 404
      }
      return {
        loading: data.loading,
        updates: data.updates,
        error,
        update
      }
    }
  })
)(({updates, update, t, loading, error, url, serverContext}) => (
  <Loader loading={loading} error={error} render={() => {
    if (update) {
      if (update === 404) {
        return (
          <StatusError
            url={url}
            statusCode={404}
            serverContext={serverContext} />
        )
      }
      return (
        <NarrowContainer>
          <Content>
            <Meta data={{
              title: update.title,
              description: update.metaDescription,
              url: `${PUBLIC_BASE_URL}/updates/${update.slug}`,
              image: update.socialMediaImage
            }} />
            <Update data={update} />
            <Link route='updates'>
              <a {...linkRule}>{t('updates/all')}</a>
            </Link>
          </Content>
        </NarrowContainer>
      )
    }

    return (
      <NarrowContainer>
        <Content>
          <Meta data={{
            pageTitle: t('updates/pageTitle'),
            title: t('updates/title'),
            description: t('updates/metaDescription'),
            url: `${PUBLIC_BASE_URL}/updates`,
            image: `${STATIC_BASE_URL}/static/social-media/logo.png`
          }} />
          {updates.map(update => (
            <Update key={update.slug} data={update} />
          ))}
        </Content>
      </NarrowContainer>
    )
  }} />
))

export default Overview
