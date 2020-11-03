import React from 'react'
import { compose } from 'react-apollo'

import { withDiscussionDocumentMeta } from './enhancers'
import withT from '../../lib/withT'
import Link from '../Link/Href'
import { inQuotes, linkRule } from '@project-r/styleguide'

const ArticleDiscussionHeadline = ({ t, discussionId, meta, documentMeta }) => {
  const articleMeta = meta || documentMeta
  if (!discussionId || !articleMeta || !articleMeta.title) {
    return null
  }

  const ArticleLink = (
    <Link href={articleMeta.path} passHref key='articlelink'>
      <a {...linkRule} href={articleMeta.path}>
        {inQuotes(articleMeta.title)}
      </a>
    </Link>
  )

  return (
    <>
      {t.elements('feedback/autoArticle/selected/headline', {
        link: ArticleLink
      })}
    </>
  )
}

export default compose(
  withT,
  withDiscussionDocumentMeta
)(ArticleDiscussionHeadline)
