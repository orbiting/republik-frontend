import React from 'react'
import { css } from 'glamor'
import {
  FormatTag,
  useColorContext,
  useHeaderHeight
} from '@project-r/styleguide'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { rerouteDiscussion } from './DiscussionLink'

const styles = {
  tagsContainer: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '15px 7px',
    margin: '0 -7px',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    position: 'sticky',
    zIndex: 10
  }),
  tagLink: css({
    marginRight: 15
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
    <div {...styles.tagLink}>
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
  const tags = discussion.tags
  if (!tags?.length) return null
  const tagBuckets = discussion.tagBuckets
  const allBuckets = tags.map(tag => ({
    value: tag,
    count: tagBuckets.find(t => t.value === tag)?.count || 0
  }))
  const totalCount = discussion.allComments.totalCount
  return (
    <div
      {...styles.tagsContainer}
      {...colorScheme.set('borderColor', 'divider')}
      {...colorScheme.set('background', 'default')}
      style={{ top: headerHeight }}
    >
      <TagLink key='all' tag={undefined} commentCount={totalCount} />
      {allBuckets.map(tag => (
        <TagLink key={tag.value} tag={tag.value} commentCount={tag.count} />
      ))}
    </div>
  )
}

export default TagFilter
