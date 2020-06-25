import React, { useEffect, useRef } from 'react'
import { compose, graphql } from 'react-apollo'
import { css } from 'glamor'
import { colors, fontStyles, mediaQueries, Loader } from '@project-r/styleguide'

import Bookmark from '../ActionBar/Bookmark'
import UserProgress from '../ActionBar/UserProgress'
import withT from '../../lib/withT'
import { withMembership } from '../Auth/checkRoles'
import Link from '../Link/Path'

import { getBookmarkedDocuments } from './queries'

const BookmarkMiniFeed = ({ t, data, ...props }) => {
  return (
    <Loader
      loading={data.loading}
      error={data.error}
      render={() => {
        const nodes = data.me.collection.items.nodes
        return (
          <div {...styles.tilesContainer} {...props}>
            {nodes.slice(0, 8).map(node => {
              const { userProgress, userBookmark } = node.document
              const {
                estimatedReadingMinutes,
                description,
                path
              } = node.document.meta
              return (
                <div {...styles.tile} key={node.id}>
                  <Link path={path} passHref>
                    <div
                      {...styles.tileHeadline}
                      onClick={() => console.log('click on first tile')}
                    >
                      {description.substring(0, 50)}
                      {description.length >= 50 ? '...' : ''}
                    </div>
                  </Link>
                  <div {...styles.iconContainer}>
                    <Bookmark bookmarked={!!userBookmark} />
                    {userProgress && estimatedReadingMinutes > 1 && (
                      <UserProgress
                        small
                        userProgress={
                          !userProgress.percentage &&
                          userProgress.max &&
                          userProgress.max.percentage === 1
                            ? userProgress.max
                            : userProgress
                        }
                      />
                    )}
                  </div>
                </div>
              )
            })}
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
      width: 0,
      background: 'transparent'
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
      flex: '0 0 300px'
    }
  }),
  tileHeadline: css({
    cursor: 'pointer',
    textAlign: 'center',
    ...fontStyles.serifBold17,
    lineHeight: '18px',
    [mediaQueries.mUp]: {
      ...fontStyles.serifBold19,
      lineHeight: '21px'
    }
  })
}

export default compose(
  withT,
  graphql(getBookmarkedDocuments),
  withMembership
)(BookmarkMiniFeed)
