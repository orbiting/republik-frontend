import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import { withDiscussionDocumentMeta } from './enhancers'
import { WithMembership, WithoutMembership } from '../Auth/withMembership'
import withT from '../../lib/withT'

import Link from '../Link/Href'

import {
  Interaction,
  linkRule
} from '@project-r/styleguide'

const ArticleDiscussionHeadline = ({ t, discussionId, meta, documentMeta }) => {
  const articleMeta = meta || documentMeta
  if (!discussionId || !articleMeta || !articleMeta.title) {
    return null
  }

  const ArticleLink = (
    <Link href={articleMeta.path} passHref key='articlelink'>
      <a {...linkRule} href={articleMeta.path}>
        «{articleMeta.title}»
      </a>
    </Link>
  )

  return (
    <Interaction.H3>
      <WithMembership render={() => (
        <Fragment>
          {t.elements('feedback/autoArticle/selected/headline', {
            link: ArticleLink
          })}
        </Fragment>
      )} />
      <WithoutMembership render={() => (
        <Fragment>
          {t.elements('feedback/autoArticle/selected/headline', {
            link: <Fragment>«{articleMeta.title}»</Fragment>
          })}
        </Fragment>
      )} />
    </Interaction.H3>
  )
}

export default compose(
  withT,
  withDiscussionDocumentMeta
)(ArticleDiscussionHeadline)
