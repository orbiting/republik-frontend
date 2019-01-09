import React, { Component } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import Frame from '../Frame'
import { enforceMembership } from '../Auth/withMembership'
import gql from 'graphql-tag'
import DocumentListContainer, { documentListQueryFragment } from '../Feed/DocumentListContainer'
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
  query getDocuments($cursor: String) {
    me {
      id
      documentList(name: "bookmarks") {
        id
        documents: userDocuments( first: 50, after: $cursor) {
          ...DocumentListConnection
        }
      }
    }
  }
  ${documentListQueryFragment}
`

const getDocuments = data => data.me.documentList

const feedLink = <Link route='feed'>
  <a {...linkRule}>
    {t('pages/feed/title')}
  </a>
</Link>

const bookmarkIcon = <IconDefault size={22} />

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
            getDocuments={getDocuments}
            placeholder={
              <Interaction.P>{t.elements('pages/bookmarks/placeholder', {
                feedLink,
                bookmarkIcon
              })}</Interaction.P>
            }
          />
        </Center>
      </Frame>
    )
  }
}

export default compose(
  withT,
  enforceMembership()
)(Page)
