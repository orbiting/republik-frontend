import React from 'react'
import { css } from 'glamor'
import {
  Loader,
  FormatTag,
  useColorContext,
  useHeaderHeight
} from '@project-r/styleguide'
import { withDiscussionComments } from './graphql/enhancers/withDiscussionComments'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { rerouteDiscussion } from './DiscussionLink'

const styles = {
  tagsContainer: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '15px 0',
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

const TagFilter = ({ tags, totalCount }) => {
  const [colorScheme] = useColorContext()
  const [headerHeight] = useHeaderHeight()

  return (
    <div
      {...styles.tagsContainer}
      {...colorScheme.set('borderColor', 'divider')}
      {...colorScheme.set('background', 'default')}
      style={{ top: headerHeight }}
    >
      <TagLink key='all' tag={undefined} commentCount={totalCount} />
      {tags.map(tag => (
        <TagLink key={tag.value} tag={tag.value} commentCount={tag.count} />
      ))}
    </div>
  )
}

const TagFilterLoader = withDiscussionComments(({ discussionComments }) => (
  <Loader
    loading={discussionComments.loading}
    error={discussionComments.error}
    render={() => {
      const tags = discussionComments?.discussion?.tags
      if (!tags?.length) return null
      const tagBuckets = discussionComments?.discussion?.tagBuckets
      const allBuckets = tags.map(tag => ({
        value: tag,
        count: tagBuckets.find(t => t.value === tag)?.count || 0
      }))
      const totalCount = tagBuckets.reduce(
        (acc, bucket) => acc + bucket.count,
        0
      )
      return <TagFilter tags={allBuckets} totalCount={totalCount} />
    }}
  />
))

export default TagFilterLoader
