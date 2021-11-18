import React from 'react'
import { css } from 'glamor'
import {
  FormatTag,
  useColorContext,
  useHeaderHeight,
  Scroller,
  mediaQueries
} from '@project-r/styleguide'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { rerouteDiscussion } from './DiscussionLink'

const BREAKOUT_PADDING = 15

const styles = {
  container: css({
    position: 'sticky',
    zIndex: 10,
    margin: `24px -${BREAKOUT_PADDING}px`
  }),
  hr: css({
    margin: 0,
    display: 'block',
    border: 0,
    position: 'absolute',
    bottom: 0,
    height: 1,
    left: 0,
    right: 0,
    [mediaQueries.mUp]: {
      left: BREAKOUT_PADDING,
      right: BREAKOUT_PADDING
    }
  }),
  tagLinkContainer: css({
    // FormatTag have margin: '0 5px 15px' to keep in mind
    padding: '15px 0 10px',
    marginRight: 10
  })
}

const TagLink = ({ tag, commentCount }) => {
  const route = useRouter()
  const {
    query: { tag: activeTag }
  } = route
  const isSelected = tag === activeTag
  const targetHref = rerouteDiscussion(route, {
    tag: isSelected ? undefined : tag
  })
  return (
    <div {...styles.tagLinkContainer}>
      <Link href={targetHref} scroll={false} passHref>
        <a>
          <FormatTag
            color={isSelected ? 'text' : 'textSoft'}
            label={tag || 'Alle'}
            count={commentCount}
          />
        </a>
      </Link>
    </div>
  )
}

const TagFilter = ({ discussion }) => {
  const [colorScheme] = useColorContext()
  const [headerHeight] = useHeaderHeight()
  const route = useRouter()
  const {
    query: { tag: activeTag }
  } = route
  const tags = discussion.tags
  if (!tags?.length) return null
  const tagBuckets = discussion.tagBuckets
  const totalCount = discussion.allComments.totalCount

  return (
    <div
      {...styles.container}
      {...colorScheme.set('background', 'default')}
      style={{ top: headerHeight }}
    >
      <Scroller
        innerPadding={BREAKOUT_PADDING}
        activeChildIndex={tags.findIndex(tag => tag === activeTag)}
      >
        {[undefined, ...tags].map((tag, i) => (
          <TagLink
            key={tag || i}
            tag={tag}
            commentCount={
              !tag
                ? totalCount
                : tagBuckets.find(t => t.value === tag)?.count || 0
            }
          />
        ))}
      </Scroller>
      <hr {...styles.hr} {...colorScheme.set('backgroundColor', 'divider')} />
    </div>
  )
}

export default TagFilter
