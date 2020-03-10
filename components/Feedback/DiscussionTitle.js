import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import { withDiscussionDocumentMeta } from './enhancers'
import { WithMembership, WithoutMembership } from '../Auth/withMembership'
import withT from '../../lib/withT'

import Link from '../Link/Href'

import { Interaction, inQuotes, linkRule } from '@project-r/styleguide'

const ArticleDiscussionHeadline = ({ t, discussionId, meta, documentMeta }) => {
  const articleMeta = meta || documentMeta
  if (!discussionId || !articleMeta || !articleMeta.title) {
    return null
  }

  return (
    <Link href={articleMeta.path} passHref key='articlelink'>
      <a {...linkRule} href={articleMeta.path}>
        {inQuotes(articleMeta.title)}
      </a>
    </Link>
  )
}

export default compose(
  withT,
  withDiscussionDocumentMeta
)(ArticleDiscussionHeadline)
