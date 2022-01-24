import React from 'react'
import { inQuotes } from '@project-r/styleguide'

import { useDiscussion } from '../DiscussionContext'
import Meta from '../../../Frame/Meta'
import { getFocusUrl } from '../../shared/CommentLink'
import { useTranslation } from '../../../../lib/withT'

/**
 * Render meta tags for a focused comment.
 * @constructor
 */
const DiscussionMetaHelper = () => {
  const { t } = useTranslation()
  const { discussion, loading, error } = useDiscussion()

  if (loading || error || !discussion) {
    return null
  }

  if (discussion.comments.focus) {
    const metaFocus = discussion.comments.focus

    return (
      <Meta
        data={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          title: t('discussion/meta/focus/title', {
            authorName: metaFocus.displayAuthor.name,
            quotedDiscussionTitle: inQuotes(discussion.title)
          }),
          description: metaFocus.preview ? metaFocus.preview.string : undefined,
          url: getFocusUrl(discussion, discussion.comments.focus)
        }}
      />
    )
  }

  return null
}

export default DiscussionMetaHelper
