import React, { useState } from 'react'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'
import Frame from '../Frame'
import { enforceMembership } from '../Auth/withMembership'
import { withTester } from '../Auth/checkRoles'
import DocumentListContainer from '../Feed/DocumentListContainer'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

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

const getConnection = data => data.me.collectionItems

const mergeConnection = (data, connection) => {
  return {
    ...data,
    me: {
      ...data.me,
      collectionItems: connection
    }
  }
}

const bookmarkIcon = <MdBookmarkBorder size={22} key='icon' />

const Page = ({ t, me, isTester }) => {
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
  const showProgressTabs = !!(me?.progressConsent && isTester)
  return (
    <Frame
      meta={{
        title: t('nav/bookmarks')
      }}
      raw
    >
      <Center>
        <div {...styles.title}>{t('pages/bookmarks/title')}</div>
        {showProgressTabs ? (
          <div {...styles.filter}>
            <Interaction.P>
              {['continue', 'bookmarks', 'read'].map(key => (
                <button
                  key={key}
                  onClick={() => handleFilterClick(key)}
                  {...plainButtonRule}
                  {...styles.filterItem}
                  style={{
                    textDecoration: filter === key ? 'underline' : 'none'
                  }}
                >
                  {t(`pages/bookmarks/tab/${key}`)}
                </button>
              ))}
            </Interaction.P>
          </div>
        ) : null}

        <DocumentListContainer
          query={getBookmarkedDocuments}
          variables={
            showProgressTabs
              ? variables
              : {
                  collections: ['bookmarks'],
                  progress: 'UNFINISHED'
                }
          }
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
            <Interaction.P {...styles.helpText}>
              {showProgressTabs
                ? t(`pages/bookmarks/help/${filter}`)
                : t(`pages/bookmarks/help`)}
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
    marginBottom: 16
  }),
  filterItem: css({
    marginRight: 24,
    textAlign: 'left'
  }),
  helpText: css({
    ...fontStyles.sansSerifRegular16,
    marginBottom: 36
  })
}

export default compose(withT, withMe, enforceMembership(), withTester)(Page)
