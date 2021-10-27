import React from 'react'
import { css } from 'glamor'
import { Loader, FormatTag, useColorContext } from '@project-r/styleguide'
import { withDiscussionComments } from './graphql/enhancers/withDiscussionComments'
import Link from 'next/link'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'

const styles = {
  tagsContainer: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '15px 0',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    position: 'sticky',
    zIndex: 10,
    top: 0
  }),
  tagLink: css({
    marginRight: 15
  })
}

const TagLink = compose(withRouter)(({ router, tag }) => {
  const { query } = router
  const currentTag = query.t
  const isSelected = tag === currentTag
  const isNotSelected = currentTag && !isSelected
  const updatedQuery = { ...query, t: tag }
  if (isSelected) {
    delete updatedQuery.t
  }
  return (
    <div {...styles.tagLink}>
      <Link
        href={{ pathname: '/[...path]', query: updatedQuery }}
        scroll={false}
        passHref
      >
        <a>
          <FormatTag
            color={isNotSelected ? 'textSoft' : 'text'}
            label={tag}
            count={12}
          />
        </a>
      </Link>
    </div>
  )
})

const TagFilter = ({ tags }) => {
  const [colorScheme] = useColorContext()

  return (
    <div
      {...styles.tagsContainer}
      {...colorScheme.set('borderColor', 'divider')}
      {...colorScheme.set('background', 'default')}
    >
      {tags.map(tag => (
        <TagLink key={tag} tag={tag} />
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
      return <TagFilter tags={tags} />
    }}
  />
))

export default TagFilterLoader
