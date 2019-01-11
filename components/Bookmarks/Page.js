import React, { Component } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import Frame from '../Frame'
import { enforceMembership } from '../Auth/withMembership'
import { enforceAuthorization } from '../Auth/withAuthorization'
import gql from 'graphql-tag'
import DocumentListContainer, { documentFragment } from '../Feed/DocumentListContainer'
import withT, { t } from '../../lib/withT'

import {
  mediaQueries,
  fontStyles,
  Center,
  Interaction,
  linkRule
} from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import IconDefault from 'react-icons/lib/md/bookmark-outline'

import { BOOKMARKS_COLLECTION_NAME } from './fragments'

const styles = {
  title: css({
    ...fontStyles.sansSerifMedium58,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 80,
    [mediaQueries.onlyS]: {
      ...fontStyles.sansSerifMedium40,
      marginBottom: 50
    }
  })
}

const query = gql`
  query getBookmarkedDocuments($cursor: String) {
    me {
      id
      collection(name: "${BOOKMARKS_COLLECTION_NAME}") {
        id
        items(first: 50, after: $cursor) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            id
            createdAt
            document {
              ...DocumentListDocument
            }
          }
        }
      }
    }
  }
  ${documentFragment}
`

const getConnection = data => data.me.collection.items
const mergeConnection = (data, connection) => ({
  ...data,
  me: {
    ...data.me,
    collection: {
      ...data.me.collection,
      items: connection
    }
  }
})

const feedLink = <Link route='feed' key='link'>
  <a {...linkRule}>
    {t('pages/feed/title')}
  </a>
</Link>

const bookmarkIcon = <IconDefault size={22} key='icon' />

class Page extends Component {
  render () {
    const { t } = this.props
    const meta = {
      title: t('nav/bookmarks')
    }

    return (
      <Frame meta={meta} raw>
        <Center>
          <div {...styles.title}>{t('pages/bookmarks/title')}</div>
          <DocumentListContainer
            query={query}
            getConnection={getConnection}
            mergeConnection={mergeConnection}
            mapNodes={node => node.document}
            placeholder={
              <Interaction.P style={{ marginBottom: 60 }}>
                {t.elements('pages/bookmarks/placeholder', {
                  feedLink,
                  bookmarkIcon
                })}
              </Interaction.P>
            }
          />
        </Center>
      </Frame>
    )
  }
}

export default compose(
  withT,
  enforceMembership(),
  // ToDo: remove editor guard for public launch.
  enforceAuthorization(['editor'])
)(Page)
