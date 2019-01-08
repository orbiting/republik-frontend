import React, { Component } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import Frame from '../Frame'
import { enforceMembership } from '../Auth/withMembership'
import withT from '../../lib/withT'
import gql from 'graphql-tag'
import DocumentListContainer, { documentListQueryFragment } from '../Feed/DocumentListContainer'

import {
  mediaQueries,
  fontStyles,
  Center
} from '@project-r/styleguide'

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
        documents: userDocuments( first: 50, after: $cursor) {
          ...DocumentListConnection
        }
      }
    }
  }
  ${documentListQueryFragment}
`

const getDocuments = data => data.me.documentList

class Page extends Component {
  render () {
    const { t } = this.props
    const meta = {
      title: t('nav/bookmarks')
    }

    return (
      <Frame meta={meta} raw>
        <Center>
          <div {...styles.title}>{t('nav/bookmarks')}</div>
          <DocumentListContainer
            query={query}
            getDocuments={getDocuments}
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
