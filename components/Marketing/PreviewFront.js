import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {css} from 'glamor'
import { Interaction, colors, mediaQueries } from '@project-r/styleguide'
import createFrontSchema from '@project-r/styleguide/lib/templates/Front'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import withMembership from '../Auth/withMembership'

import StatusError from '../StatusError'
import Loader from '../Loader'
import Link from '../Link/Href'
import SSRCachingBoundary from '../SSRCachingBoundary'

import { renderMdast } from 'mdast-react-render'

const styles = {
  noMember: css({
    margin: '0 -15px',
    backgroundColor: colors.primaryBg,
    textAlign: 'center',
    padding: '18px 15px',
    [mediaQueries.mUp]: {
      padding: '30px 15px'
    }
  })
}

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

const Prestitial = ({ me, isMember, t }) => {
  const text = me && !isMember
    ? t.elements('marketing-20/preview/prestitial/noMembership', { link: <a href='/'>{t('marketing-20/preview/prestitial/noMembership/link')}</a> })
    : t('marketing-20/preview/prestitial/withMembership')

  return <div {...styles.noMember}>
    <Interaction.P>
      {text}
    </Interaction.P>
  </div>
}

const PreviewFront = ({ url, data, data: { front }, t, me, isMember }) => {
  return (
    <Fragment>
      <Prestitial isMember={isMember} me={me} t={t} />
      <Loader loading={data.loading} error={data.error} message={t('pages/magazine/title')} render={() => {
        if (!front) {
          return <StatusError
            url={url}
            statusCode={404}
            serverContext={this.props.serverContext} />
        }

        return (
          <SSRCachingBoundary key='content' cacheKey={front.id}>
            {() => renderMdast(front.content, schema)}
          </SSRCachingBoundary>
        )
      }} />
    </Fragment>
  )
}

export default compose(
  withMe,
  withMembership,
  withT,
  graphql(getDocument, {
    options: () => ({
      variables: {
        path: '/preview-front'
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
)(PreviewFront)
