import React from 'react'
import { colors, TeaserFeed } from '@project-r/styleguide'
import ActionBar from '../ActionBar/Feed'
import Link from '../Link/Href'
import { css } from 'glamor'

const styles = {
  highlight: css({
    '& em': {
      background: colors.primaryBg,
      fontStyle: 'normal'
    }
  })
}

export default ({ node }) => {
  const titleHighlight = node.highlights.find(
    highlight => highlight.path === 'meta.title'
  )
  const descHighlight = node.highlights.find(
    highlight => highlight.path === 'meta.description'
  )
  const actionBar = node.entity.meta ? (
    <ActionBar
      documentId={node.entity.id}
      userBookmark={node.entity.userBookmark}
      userProgress={node.entity.userProgress}
      {...node.entity.meta}
    />
  ) : null

  return (
    <TeaserFeed
      {...node.entity.meta}
      title={
        titleHighlight ? (
          <span
            {...styles.highlight}
            dangerouslySetInnerHTML={{
              __html: titleHighlight.fragments[0]
            }}
          />
        ) : (
          node.entity.meta.shortTitle || node.entity.meta.title
        )
      }
      description={
        descHighlight ? (
          <span
            {...styles.highlight}
            dangerouslySetInnerHTML={{
              __html: descHighlight.fragments[0]
            }}
          />
        ) : (
          !node.entity.meta.shortTitle && node.entity.meta.description
        )
      }
      kind={
        node.entity.meta.template === 'editorialNewsletter'
          ? 'meta'
          : node.entity.meta.kind
      }
      publishDate={
        node.entity.meta.template === 'format'
          ? null
          : node.entity.meta.publishDate
      }
      Link={Link}
      key={node.entity.meta.path}
      bar={actionBar}
    />
  )
}
