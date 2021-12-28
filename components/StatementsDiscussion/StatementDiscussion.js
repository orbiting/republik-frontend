import React, { useContext, useMemo } from 'react'
import { StatementList } from '@project-r/styleguide'
import { useMe } from '../../lib/context/MeContext'
import Loader from '../Loader'
import StatementComposer from './StatementComposer'
import withT from '../../lib/withT'
import TagFilter from '../Discussion/TagFilter'
import OrderByTabs from '../Discussion/OrderByTabs'
import { useDiscussion } from '../Discussion/DiscussionProvider/context/DiscussionContext'
import { postMessage, useInNativeApp } from '../../lib/withInNativeApp'
import { getFocusUrl } from '../Discussion/CommentLink'

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

  const filteredStatements = useMemo(
    () =>
      discussion && discussion.comments
        ? discussion.comments.nodes.filter(
            comment => !comment.adminUnpublished && !comment.unpublished
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

  return (
    <Loader
      loading={loading || !discussion}
      error={error}
      render={() => (
        <div>
          <div>
            <TagFilter discussion={discussion} />
            {actions.handleSubmit && (
              <StatementComposer
                t={t}
                refetch={refetch}
                submitHandler={actions.handleSubmit}
              />
            )}
          </div>
          <div>
            <OrderByTabs
              t={t}
              resolvedOrderBy={discussion.comments.resolvedOrderBy || orderBy}
            />
            <StatementList
              t={t}
              comments={filteredStatements}
              tagMappings={tagMappings}
              actions={{
                handleUpVote: actions.handleUpVote,
                handleDownVote: actions.handleDownVote,
                handleUnVote: actions.handleUnVote,
                handleShare: shareComment
              }}
              disableVoting={!me && !discussion.userCanComment}
              loadMore={loadMore}
              moreAvailableCount={
                discussion.comments.totalCount -
                discussion.comments.nodes.length
              }
            />
          </div>
        </div>
      )}
    />
  )
}

export default withT(StatementDiscussion)
