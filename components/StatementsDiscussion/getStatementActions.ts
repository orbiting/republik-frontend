import { EditIcon, ReportIcon, UnpublishIcon } from '@project-r/styleguide'
import { DiscussionActions } from '../Discussion/DiscussionProvider/hooks/useDiscussionActions'

function getStatementActions(
  comment: nerver,
  actions: DiscussionActions,
  roles: string[],
  t: any
) {
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
      action: () => {
        if (window.confirm(t('styleguide/CommentActions/reportMessage'))) {
          actions.reportCommentHandler(comment)
        }
      }
    })
  }

  // TODO: Implement edit statement
  /*if (comment.userCanEdit && !comment.adminUnpublished) {
    items.push({
      icon: EditIcon,
      label: t('styleguide/CommentActions/edit'),
      action: () =>
    })
  }*/

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
      action: () => actions.unpublishCommentHandler(comment)
    })
  }

  return items
}

export default getStatementActions
