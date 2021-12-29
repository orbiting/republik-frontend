import React, { useMemo } from 'react'
import { StatementList } from '@project-r/styleguide'
import { useMe } from '../../lib/context/MeContext'
import Loader from '../Loader'
import StatementComposer from './StatementComposer'
import withT from '../../lib/withT'
import TagFilter from '../Discussion/TagFilter'
import { useDiscussion } from '../Discussion/DiscussionProvider/context/DiscussionContext'
import { postMessage, useInNativeApp } from '../../lib/withInNativeApp'
import { getFocusHref, getFocusUrl } from '../Discussion/CommentLink'
import CommentsOptions from '../Discussion/CommentsOptions'
import { useRouter } from 'next/router'
import StatementNodeWrapper from './StatementNodeWrapper'

const StatementDiscussion = ({ t, tagMappings }) => {
  const {
    discussion,
    loading,
    error,
    refetch,
    actions,
    fetchMore,
    orderBy,
    overlays: { shareOverlay }
  } = useDiscussion()
  const { me } = useMe()
  const { inNativeApp } = useInNativeApp()
  const router = useRouter()

  const filteredStatements = useMemo(
    () =>
      discussion && discussion.comments
        ? discussion.comments.nodes.filter(
            comment => comment.published && !comment.adminUnpublished
          )
        : [],
    [discussion]
  )

  const loadMore = () => {
    if (!discussion) return
    const lastNode =
      discussion.comments.nodes[discussion.comments.nodes.length - 1]
    const endCursor = discussion.comments.pageInfo.endCursor
    fetchMore({
      after: endCursor,
      appendAfter: lastNode.id
    })
  }

  const shareComment = async comment => {
    if (inNativeApp) {
      postMessage({
        type: 'share',
        payload: {
          title: discussion.title,
          url: getFocusUrl(discussion, comment),
          subject: t('discussion/share/emailSubject', {
            title: discussion.title
          }),
          dialogTitle: t('article/share/title')
        }
      })
    } else {
      shareOverlay.handleOpen(getFocusUrl(discussion, comment))
    }
    return Promise.resolve({ ok: true })
  }

  const handleReload = e => {
    e.preventDefault()
    const href = getFocusHref(discussion)
    if (href) {
      router.replace(href).then(() => {
        refetch({
          focusId: undefined
        })
      })
    } else {
      refetch()
    }
  }

  return (
    <Loader
      loading={loading || !discussion}
      error={error}
      render={() => (
        <div>
          <div>
            <TagFilter discussion={discussion} />
            {actions.submitCommentHandler && (
              <StatementComposer
                t={t}
                refetch={refetch}
                submitHandler={(content, tags) =>
                  actions.submitCommentHandler(content, tags, {
                    discussionId: discussion.id
                  })
                }
                tags={discussion.tags}
              />
            )}
          </div>
          <div>
            <CommentsOptions
              t={t}
              resolvedOrderBy={discussion.comments.resolvedOrderBy || orderBy}
              handleReload={handleReload}
              discussion={discussion}
              router={router}
            />
            <StatementList
              t={t}
              comments={filteredStatements}
              tagMappings={tagMappings}
              loadMore={loadMore}
              moreAvailableCount={
                discussion.comments.totalCount -
                discussion.comments.nodes.length
              }
            >
              {filteredStatements.map(comment => (
                <StatementNodeWrapper
                  key={comment.id}
                  comment={comment}
                  tagMappings={tagMappings}
                />
              ))}
            </StatementList>
          </div>
        </div>
      )}
    />
  )
}

export default withT(StatementDiscussion)
