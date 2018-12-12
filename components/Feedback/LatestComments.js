import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { withComments } from './enhancers'
import withT from '../../lib/withT'
import { matchType } from 'mdast-react-render/lib/utils'
import { renderMdast } from 'mdast-react-render'
import timeago from '../../lib/timeago'

import ArticleItem from './ArticleItem'
import { Link } from '../../lib/routes'
import PathLink from '../Link/Path'

import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'

import { CommentTeaser, Editorial, Loader } from '@project-r/styleguide'

const br = {
  matchMdast: matchType('break'),
  component: () => <br />,
  isVoid: true
}

const link = {
  matchMdast: matchType('link'),
  props: node => ({
    title: node.title,
    href: node.url
  }),
  component: Editorial.A
}

const creditSchema = {
  rules: [link, br]
}

export const CommentLink = ({
  displayAuthor,
  commentId,
  children,
  discussion
}) => {
  let tab
  if (discussion && discussion.document) {
    const meta = discussion.document.meta || {}
    const ownDiscussion = meta.ownDiscussion && !meta.ownDiscussion.closed
    const template = meta.template
    tab =
      (ownDiscussion && template === 'article' && 'article') ||
      (discussion && discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID && 'general')
  }
  if (displayAuthor && displayAuthor.username) {
    return (
      <Link
        route='profile'
        params={{ slug: displayAuthor.username }}
      >
        {children}
      </Link>
    )
  }
  if (tab) {
    return (
      <Link
        route='discussion'
        params={{ t: tab, id: discussion ? discussion.id : undefined, focus: commentId }}
        passHref
      >
        {children}
      </Link>
    )
  }
  if (discussion) {
    const focus = commentId
    const path = discussion &&
      discussion.document &&
      discussion.document.meta &&
      discussion.document.meta.path
    if (path) {
      return (
        <PathLink
          path={path}
          query={{ focus }}
          passHref
        >
          {children}
        </PathLink>
      )
    }
    return (
      <Link
        route='discussion'
        params={{ id: discussion.id, focus }}
      >
        {children}
      </Link>
    )
  }
  return children
}

class LatestComments extends Component {
  render () {
    const { t, data, onTeaserClick, filter = [] } = this.props

    const timeagoFromNow = createdAtString => {
      return timeago(t, (new Date() - Date.parse(createdAtString)) / 1000)
    }

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const { comments } = data
          return (
            <div>
              {comments && comments.nodes
                .filter(node => filter.indexOf(node.discussion.id) === -1)
                .map(
                  node => {
                    const {
                      id,
                      discussion,
                      preview,
                      displayAuthor,
                      published,
                      createdAt,
                      updatedAt,
                      tags
                    } = node
                    const meta = (discussion && discussion.document && discussion.document.meta) || {}
                    const isGeneral = discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID
                    const newPage = !isGeneral && meta.template === 'discussion'

                    const onClick = (e) => {
                      e.preventDefault()
                      onTeaserClick({
                        discussionId: discussion.id,
                        meta,
                        focusId: id
                      })
                    }

                    const contextTitle = !isGeneral && discussion.title
                      ? <ArticleItem
                        iconSize={18}
                        title={`«${discussion.title}»`}
                        newPage={newPage} />
                      : undefined

                    const contextDescription = contextTitle && meta.credits && meta.credits.length > 0
                      ? renderMdast(meta.credits, creditSchema)
                      : undefined
                    const articleContext = contextTitle ? {
                      title: contextTitle,
                      description: contextDescription
                    } : undefined

                    return (
                      <CommentTeaser
                        key={id}
                        id={id}
                        t={t}
                        displayAuthor={displayAuthor}
                        preview={preview}
                        published={published}
                        createdAt={createdAt}
                        updatedAt={updatedAt}
                        timeago={timeagoFromNow}
                        context={articleContext}
                        tags={tags}
                        Link={CommentLink}
                        discussion={discussion}
                        onPreviewClick={newPage ? undefined : onClick}
                      />
                    )
                  }
                )}
            </div>
          )
        }} />
    )
  }
}

export default compose(
  withT,
  withComments
)(LatestComments)
