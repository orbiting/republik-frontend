import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import Loader from '../Loader'

import schema from './schema'

import { renderMdast } from 'mdast-react-render'

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
    const { data } = this.props

    return <Loader loading={data.loading} error={data.error} message={t('pages/magazine/title')} render={() => {
      return renderMdast(data.front.content, schema)
    }} />
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
