import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import createFrontSchema from '@project-r/styleguide/lib/templates/Front'

import withT from '../../lib/withT'
import Loader from '../Loader'
import Frame from '../Frame'
import Link from '../Link/Href'

import { renderMdast } from 'mdast-react-render'

import { PUBLIC_BASE_URL } from '../../lib/constants'

const schema = createFrontSchema({
  Link
})

const getDocument = gql`
  query getFront($path: String!) {
    front: document(path: $path) {
      id
      content
      meta {
        path
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
      title: front.meta.title || t('pages/magazine/title'),
      url: `${PUBLIC_BASE_URL}${front.meta.path}`
    }

    return (
      <Frame
        raw
        url={url}
        meta={meta}
      >
        <Loader
          loading={data.loading}
          error={data.error}
          message={t('pages/magazine/title')}
          render={() => renderMdast(front.content, schema)}
          />
      </Frame>
    )
  }
}

export default compose(
  withT,
  graphql(getDocument, {
    options: () => ({
      variables: {
        path: '/'
      }
    }),
    props: ({data, ownProps: {serverContext}}) => {
      if (serverContext && !data.error && !data.loading && !data.front) {
        serverContext.res.statusCode = 503
      }

      return {
        data
      }
    }
  })
)(Front)
