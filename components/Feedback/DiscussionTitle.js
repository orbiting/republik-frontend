import React from 'react'
import { compose } from 'react-apollo'

import { withDiscussionDocumentMeta } from './enhancers'
import withT from '../../lib/withT'
import Link from '../Link/Href'
import { inQuotes, A } from '@project-r/styleguide'

const ArticleDiscussionHeadline = ({ t, discussionId, meta, documentMeta }) => {
  const articleMeta = meta || documentMeta
  if (!discussionId || !articleMeta || !articleMeta.title) {
    return null
  }

  const ArticleLink = (
    <Link href={articleMeta.path} passHref key='articlelink'>
      <A href={articleMeta.path}>{inQuotes(articleMeta.title)}</A>
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
