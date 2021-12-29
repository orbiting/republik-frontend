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
  const { actions, discussion } = useDiscussion()
  const {
    me: { roles }
  } = useMe()

  const menuItems = useMemo(() => {
    return getStatementActions(comment, actions, roles, t)
  }, [comment, actions, discussion])

  return (
    <StatementNode
      comment={comment}
      t={t}
      actions={{
        handleUpVote: actions.upVoteCommentHandler,
        handleDownVote: actions.downVoteCommentHandler,
        handleUnVote: actions.unVoteCommentHandler,
        handleShare: actions
      }}
      menuItems={menuItems}
      tagMappings={tagMappings}
    />
  )
}

export default StatementNodeWrapper
