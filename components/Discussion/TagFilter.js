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
  const {
    pathname,
    query: { tag: activeTag, ...restQuery }
  } = useRouter()
  const isSelected = tag === activeTag
  const isInactive = activeTag && !isSelected
  const targetQuery = isSelected ? restQuery : { ...restQuery, tag }
  if (isSelected) {
    delete targetQuery.tag
  }
  return (
    <div {...styles.tagLink}>
      <Link href={{ pathname, query: targetQuery }} scroll={false} passHref>
        <a>
          <FormatTag
            color={isInactive ? 'textSoft' : 'text'}
            label={tag}
            count={commentCount}
          />
        </a>
      </Link>
    </div>
  )
}

const TagFilter = ({ tags }) => {
  const [colorScheme] = useColorContext()
  const [headerHeight] = useHeaderHeight()

  return (
    <div
      {...styles.tagsContainer}
      {...colorScheme.set('borderColor', 'divider')}
      {...colorScheme.set('background', 'default')}
      style={{ top: headerHeight }}
    >
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
      const tagBuckets = [...discussionComments?.discussion?.tagBuckets].sort(
        (a, b) => tags.indexOf(a.value) - tags.indexOf(b.value)
      )
      return <TagFilter tags={tagBuckets} />
    }}
  />
))

export default TagFilterLoader
