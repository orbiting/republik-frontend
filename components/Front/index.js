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

    return <Loader loading={data.loading} error={data.error} render={() => {
      return renderMdast(data.front.content, schema)
    }} />
    // return (
    //   <div style={{backgroundColor: '#ddd', padding: '40vh 0', height: `calc(100vh - ${HEADER_HEIGHT}px)`}}>
    //     <H1 style={{textAlign: 'center'}}>{t('pages/magazine/title')}</H1>

    //   </div>
    // )
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
