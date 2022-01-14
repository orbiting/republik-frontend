import React, { useMemo, useState } from 'react'
import { CommentNode } from '@project-r/styleguide'
import { CommentFragmentType } from '../DiscussionProvider/graphql/fragments/CommentFragment.graphql'
import { useTranslation } from '../../../lib/withT'
import Link from 'next/link'
import { getFocusHref } from '../CommentLink'
import { format } from 'url'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'

type Props = {
  comment: CommentFragmentType
}

const CommentNodeWrapper = ({ comment }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  const { discussion } = useDiscussion()

  const { t } = useTranslation()

  const focusHref = useMemo(() => {
    const urlObject = getFocusHref(discussion, comment)
    return format(urlObject)
  }, [discussion, comment])

  if (isEditing) {
    return 'Edit-Composer'
  }

  return (
    <CommentNode comment={comment} t={t} Link={Link} focusHref={focusHref}>
      {isReplying && 'Reply-Composer'}
    </CommentNode>
  )
}

export default CommentNodeWrapper
