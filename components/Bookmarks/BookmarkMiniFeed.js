import React from 'react'
import { compose, graphql } from 'react-apollo'
import { css } from 'glamor'
import { colors, fontStyles, mediaQueries, Loader } from '@project-r/styleguide'

import BookmarkButton from '../ActionBar/BookmarkButton'
import UserProgress from '../ActionBar/UserProgress'
import Link from '../Link/Path'

import { getBookmarkedDocuments } from './queries'

const BookmarkMiniFeed = ({ data, closeHandler, style }) => {
  return (
    <Loader
      style={{ minHeight: 130 }}
      delay={200}
      loading={data.loading}
      error={data.error}
      render={() => {
        // only members have a bookmark collection
        if (!data.me.collection) {
          return null
        }
        const nodes = data.me.collection.items.nodes
        return (
          <div
            {...styles.tilesContainer}
            data-body-scroll-lock-ignore
            style={style}
          >
            {nodes
              .filter(node => node.document)
              .slice(0, 3)
              .map(node => {
                const { userProgress, userBookmark, id } = node.document
                const {
                  estimatedReadingMinutes,
                  title,
                  path
                } = node.document.meta
                return (
                  <div {...styles.tile} key={node.id}>
                    <div {...styles.tileHeadlineContainer}>
                      <Link path={path} passHref>
                        <a
                          onClick={() => closeHandler()}
                          {...styles.tileHeadline}
                        >
                          {title.substring(0, 42).trim()}
                          {title.length >= 42 && <>&nbsp;…</>}
                        </a>
                      </Link>
                    </div>
                    <div {...styles.iconContainer}>
                      <BookmarkButton
                        documentId={id}
                        bookmarked={!!userBookmark}
                        skipRefetch
                      />
                      {userProgress && estimatedReadingMinutes > 1 && (
                        <UserProgress
                          forceShortLabel
                          noCallout
                          noScroll
                          userProgress={userProgress}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            <div {...styles.spacer} />
          </div>
        )
      }}
    />
  )
}

const styles = {
  tilesContainer: css({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'scroll',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none' /* Firefox */,
    msOverflowStyle: 'none' /* IE 10+ */,
    '::-webkit-scrollbar': {
      display: 'none'
    }
  }),
  tile: css({
    width: 150,
    height: 150,
    flex: '0 0 150px',
    marginRight: 16,
    padding: '16px 8px 12px 8px',
    border: `1px solid ${colors.divider}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    ':first-child': {
      marginLeft: 16
    },
    [mediaQueries.mUp]: {
      padding: '12px 8px',
      height: 120,
      flex: '0 0 210px'
    }
  }),
  spacer: css({
    flex: '0 0 8px',
    [mediaQueries.mUp]: {
      flex: 0,
      display: 'none'
    }
  }),
  tileHeadlineContainer: css({
    flex: 1,
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center'
  }),
  tileHeadline: css({
    color: colors.text,
    textDecoration: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    wordWrap: 'break-word',
    width: '100%',
    ...fontStyles.serifBold17,
    lineHeight: '18px',
    [mediaQueries.mUp]: {
      ...fontStyles.serifBold19,
      lineHeight: '21px'
    }
  }),
  iconContainer: css({
    display: 'flex'
  })
}

export default compose(
  graphql(getBookmarkedDocuments, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)(BookmarkMiniFeed)
