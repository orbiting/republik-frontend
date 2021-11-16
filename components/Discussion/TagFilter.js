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

const styles = {
  container: css({
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    position: 'sticky',
    zIndex: 10,
    margin: '24px -15px',
    [mediaQueries.mUp]: {
      margin: '24px 0'
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
      {...colorScheme.set('borderColor', 'divider')}
      style={{ top: headerHeight }}
    >
      <Scroller
        breakoutPadding={15}
        activeChildIndex={tags.findIndex(tag => tag === activeTag)}
      >
        {['Alle', ...tags].map(tag => (
          <TagLink
            key={tag}
            tag={tag}
            commentCount={
              tag === 'Alle'
                ? totalCount
                : tagBuckets.find(t => t.value === tag)?.count || 0
            }
          />
        ))}
      </Scroller>
    </div>
  )
}

export default TagFilter
