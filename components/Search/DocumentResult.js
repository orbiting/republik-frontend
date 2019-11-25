import React from 'react'
import { colors, TeaserFeed } from '@project-r/styleguide'
import ActionBar from '../ActionBar/Feed'
import Link from '../Link/Href'
import { css, merge } from 'glamor'

const styles = {
  highlight: css({
    '& em': {
      background: colors.primaryBg,
      fontStyle: 'inherit'
    }
  }),
  textHighlight: css({
    fontStyle: 'italic'
  })
}

const findHighlight = (node, path) =>
  node.highlights.find(highlight => highlight.path === path)

export default ({ node }) => {
  const titleHighlight = findHighlight(node, 'meta.title')
  const descHighlight = findHighlight(node, 'meta.description')
  const textHighlight = findHighlight(node, 'contentString')

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
        !titleHighlight ? (
          <span
            {...merge(styles.highlight, !descHighlight && styles.textHighlight)}
            dangerouslySetInnerHTML={{
              __html: (descHighlight ? descHighlight : textHighlight)
                .fragments[0]
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
