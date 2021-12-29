import React, { ReactElement, useMemo } from 'react'
import { StatementNode } from '@project-r/styleguide'
import { useDiscussion } from '../Discussion/DiscussionProvider/context/DiscussionContext'
import { useTranslation } from '../../lib/withT'
import { useMe } from '../../lib/context/MeContext'
import getStatementActions from './getStatementActions'

type Props = {
  comment: any
  tagMappings: any
}

const StatementNodeWrapper = ({
  comment,
  tagMappings
}: Props): ReactElement => {
  const { t } = useTranslation()
  const { actions } = useDiscussion()
  const { me } = useMe()

  const menuItems = useMemo(() => {
    return getStatementActions(comment, actions, me?.roles ?? [], t)
  }, [comment, actions, me?.roles, t])

  return (
    <StatementNode
      comment={comment}
      t={t}
      actions={{
        handleUpVote: actions.upVoteCommentHandler,
        handleDownVote: actions.downVoteCommentHandler,
        handleUnVote: actions.unVoteCommentHandler,
        handleShare: actions.shareHandler
      }}
      menuItems={menuItems}
      tagMappings={tagMappings}
    />
  )
}

export default StatementNodeWrapper
