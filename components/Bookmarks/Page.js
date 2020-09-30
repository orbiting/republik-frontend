import React, { useState } from 'react'
import { css, merge } from 'glamor'
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
  linkRule,
  plainButtonRule
} from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import { MdBookmarkBorder } from 'react-icons/md'

import { getBookmarkedDocuments } from './queries'

const getConnection = data => {
  return {
    ...data.me.collectionItems,
    // [TODO] deduplicate connection, not working yet
    nodes: data.me.collectionItems.nodes.filter(
      (elem, index, array) =>
        index === array.findIndex(item => item.id === elem.id)
    )
  }
}

const mergeConnection = (data, connection) => {
  return {
    ...data,
    me: {
      ...data.me,
      collectionItems: {
        ...data.me.collectionItems,
        collectionItems: connection
      }
    }
  }
}

const bookmarkIcon = <MdBookmarkBorder size={22} key='icon' />

const Page = ({ t }) => {
  const [filter, setFilter] = useState('continue')
  const [variables, setVariables] = useState({
    collections: ['progress', 'bookmarks'],
    progress: 'UNFINISHED'
  })

  const handleFilterClick = passedFilter => {
    switch (passedFilter) {
      case 'bookmarks':
        setVariables({
          collections: ['bookmarks'],
          progress: 'UNFINISHED'
        })
        setFilter('bookmarks')
        break

      case 'read':
        setVariables({
          collections: ['progress', 'bookmarks'],
          progress: 'FINISHED'
        })
        setFilter('read')
        break

      default:
        setVariables({
          collections: ['progress', 'bookmarks'],
          progress: 'UNFINISHED'
        })
        setFilter('continue')
        break
    }
  }

  return (
    <Frame
      meta={{
        title: t('nav/bookmarks')
      }}
      raw
    >
      <Center>
        <div {...styles.title}>{t('pages/bookmarks/title')}</div>
        <div {...styles.filter}>
          <button
            onClick={() => handleFilterClick('continue')}
            {...plainButtonRule}
            {...styles.filterItem}
          >
            <Interaction.P
              title='Weiterlesen'
              {...styles.fiterItemText}
              style={{
                textDecoration: filter === 'continue' ? 'underline' : 'none'
              }}
            >
              Weiterlesen
            </Interaction.P>
          </button>
          <button
            onClick={() => handleFilterClick('bookmarks')}
            {...plainButtonRule}
            {...styles.filterItem}
          >
            <Interaction.P
              title='Lesezeichen'
              {...styles.fiterItemText}
              style={{
                textDecoration: filter === 'bookmarks' ? 'underline' : 'none'
              }}
            >
              Lesezeichen
            </Interaction.P>
          </button>
          <button
            onClick={() => handleFilterClick('read')}
            {...plainButtonRule}
            {...styles.filterItem}
          >
            <Interaction.P
              title='Gelesen'
              {...styles.fiterItemText}
              style={{
                textDecoration: filter === 'read' ? 'underline' : 'none'
              }}
            >
              Gelesen
            </Interaction.P>
          </button>
        </div>
        <DocumentListContainer
          query={getBookmarkedDocuments}
          variables={variables}
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
            <Interaction.P style={{ marginBottom: 24 }}>
              {t(`pages/bookmarks/help/${filter}`)}
            </Interaction.P>
          }
        />
      </Center>
    </Frame>
  )
}

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
  }),
  filter: css({
    display: 'flex',
    marginBottom: 40
  }),
  filterItem: css({
    marginRight: 24
  }),
  fiterItemText: css({
    textAlign: 'left'
  })
}

export default compose(withT, enforceMembership())(Page)
