import { Dispatch, SetStateAction } from 'react'
import { EditIcon, ReportIcon, UnpublishIcon } from '@project-r/styleguide'
import { DiscussionMutations } from '../Discussion/DiscussionProvider/hooks/useDiscussionMutations'

type Options = {
  comment: any
  actions: DiscussionMutations
  roles: string[]
  t: any
  setEditMode: Dispatch<SetStateAction<boolean>>
}

function getStatementActions({
  comment,
  actions,
  roles,
  t,
  setEditMode
}: Options) {
  const items = []

  if (
    comment.published &&
    comment.userCanReport &&
    actions.reportCommentHandler
  ) {
    items.push({
      icon: ReportIcon,
      label:
        comment.numReports && comment.numReports > 0
          ? t('styleguide/CommentActions/reportWithAmount', {
              amount: comment.numReports
            })
          : comment.userReportedAt
          ? t('styleguide/CommentActions/reported')
          : t('styleguide/CommentActions/report'),
      disabled: !!comment.userReportedAt,
      onClick: () => {
        if (window.confirm(t('styleguide/CommentActions/reportMessage'))) {
          actions.reportCommentHandler(comment)
        }
      }
    })
  }

  if (comment.userCanEdit && !comment.adminUnpublished) {
    items.push({
      icon: EditIcon,
      label: t('styleguide/CommentActions/edit'),
      onClick: () => setEditMode(true)
    })
  }

  const canUnpublish = roles.includes('admin') || roles.includes('moderator')

  if (
    comment.published &&
    !comment.adminUnpublished &&
    (canUnpublish || comment.userCanEdit) &&
    actions.unpublishCommentHandler
  ) {
    items.push({
      icon: UnpublishIcon,
      label: t('styleguide/CommentActions/unpublish'),
      onClick: () => {
        const message = t(
          `styleguide/CommentActions/unpublish/confirm${
            comment.userCanEdit ? '' : '/admin'
          }`,
          {
            name: comment.displayAuthor.name
          }
        )
        if (!window.confirm(message)) {
          return
        } else {
          return actions.unpublishCommentHandler(comment)
        }
      }
    })
  }

  return items
}

export default getStatementActions
