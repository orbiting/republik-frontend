import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import Loader from '../Loader'
import Frame from '../Frame'

import schema from './schema'

import { renderMdast } from 'mdast-react-render'

import { PUBLIC_BASE_URL } from '../../lib/constants'

const getDocument = gql`
  query getFront($slug: String!) {
    front: document(slug: $slug) {
      content
      meta {
        slug
        title
        description
        image
        facebookDescription
        facebookImage
        facebookTitle
        twitterDescription
        twitterImage
        twitterTitle
      }
    }
  }
`

class Front extends Component {
  render () {
    const { url, data, data: { front }, t } = this.props
    const meta = front && {
      ...front.meta,
      url: `${PUBLIC_BASE_URL}/${front.meta.slug}`
    }

    return (
      <Frame
        raw
        url={url}
        meta={meta}
      >
        <Loader loading={data.loading} error={data.error} message={t('pages/magazine/title')} render={() => {
          return renderMdast(front.content, schema)
        }} />
      </Frame>
    )
  }
}

export default compose(
  withT,
  graphql(getDocument, {
    options: () => ({
      variables: {
        slug: 'front'
      }
    }),
    props: ({data, ownProps: {serverContext}}) => {
      if (serverContext && !data.error && !data.loading && !data.article) {
        serverContext.res.statusCode = 404
      }

      return {
        data
      }
    }
  })
)(Front)
