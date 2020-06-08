import React, { Component } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import Frame from '../Frame'
import { enforceMembership } from '../Auth/withMembership'
import DocumentListContainer from '../Feed/DocumentListContainer'
import withT from '../../lib/withT'

import {
  mediaQueries,
  fontStyles,
  Center,
  Interaction,
  linkRule
} from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import { MdBookmarkBorder } from 'react-icons/md'

import { getBookmarkedDocuments } from './queries'

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

const bookmarkIcon = <MdBookmarkBorder size={22} key='icon' />

class Page extends Component {
  render() {
    const { t } = this.props
    const meta = {
      title: t('nav/bookmarks')
    }

    return (
      <Frame meta={meta} raw>
        <Center>
          <div {...styles.title}>{t('pages/bookmarks/title')}</div>
          <DocumentListContainer
            query={getBookmarkedDocuments}
            refetchOnUnmount
            getConnection={getConnection}
            mergeConnection={mergeConnection}
            mapNodes={node => node.document}
            feedProps={{ showHeader: false, showSubscribe: true }}
            placeholder={
              <Interaction.P style={{ marginBottom: 60 }}>
                {t.elements('pages/bookmarks/placeholder', {
                  feedLink: (
                    <Link route='feed' key='link'>
                      <a {...linkRule}>
                        {t('pages/bookmarks/placeholder/feedText')}
                      </a>
                    </Link>
                  ),
                  bookmarkIcon
                })}
              </Interaction.P>
            }
            help={
              <Interaction.P style={{ marginBottom: 60 }}>
                {t('pages/bookmarks/help')}
              </Interaction.P>
            }
          />
        </Center>
      </Frame>
    )
  }
}

export default compose(withT, enforceMembership())(Page)
