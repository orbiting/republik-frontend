import React from 'react'
import { TeaserFeed, colors } from '@project-r/styleguide'
import ActionBar from '../ActionBar'
import Link from '../Link/Href'
import { css } from 'glamor'
import { findHighlight } from '../../lib/utils/mdast'
import withT from '../../lib/withT'
import { formatExcerpt } from '../../lib/utils/format'

const styles = {
  highlight: css({
    '& em': {
      background: colors.highlight,
      fontStyle: 'inherit'
    }
  })
}

export default withT(({ t, node }) => {
  const titleHighlight = findHighlight(node, 'meta.title')
  const descHighlight = findHighlight(node, 'meta.description')
  const authorHighlight = findHighlight(node, 'meta.authors')
  const textHighlight = findHighlight(node, 'contentString')

  const showDescHighlight = !titleHighlight && !authorHighlight && descHighlight
  const showTextHighlight =
    !titleHighlight && !authorHighlight && !descHighlight && textHighlight

  const actionBar = node.entity.meta ? (
    <ActionBar mode='feed' document={node.entity} />
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
        (showDescHighlight || !showTextHighlight) &&
        (descHighlight ? (
          <span
            {...styles.highlight}
            dangerouslySetInnerHTML={{
              __html: descHighlight.fragments[0]
            }}
          />
        ) : (
          !node.entity.meta.shortTitle && node.entity.meta.description
        ))
      }
      highlight={
        showTextHighlight && (
          <span
            {...styles.highlight}
            dangerouslySetInnerHTML={{
              __html: formatExcerpt(textHighlight.fragments[0])
            }}
          />
        )
      }
      highlightLabel={t('search/excerpt')}
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
})
