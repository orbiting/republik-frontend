import React, { ReactElement, useState } from 'react'
import DiscussionComposerWrapper from '../DiscussionProvider/components/DiscussionComposerWrapper'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import {
  CommentComposer,
  CommentComposerPlaceholder,
  Loader
} from '@project-r/styleguide'
import useDiscussionPreferences from '../DiscussionProvider/hooks/useDiscussionPreferences'
import { useTranslation } from '../../../lib/withT'

const DialogComposer = (): ReactElement => {
  const [isActive, setIsActive] = useState(false)
  const { t } = useTranslation()
  const { id, overlays } = useDiscussion()
  const { preferencesOverlay } = overlays
  const { preferences, loading } = useDiscussionPreferences(id)

  return (
    <Loader loading={loading}>
      <DiscussionComposerWrapper>
        {isActive ? (
          <CommentComposer
            t={t}
            isRoot={}
            discussionId={}
            commentId={}
            parentId={}
            onSubmit={}
            onSubmitLabel={}
            onClose={}
            onCloseLabel={}
            onOpenPreferences={}
            onPreviewComment={}
            secondaryActions={}
            displayAuthor={}
            placeholder={}
            maxLength={}
            tags={}
            initialText={}
            initialTagValue={}
            isBoard={}
          />
        ) : (
          <CommentComposerPlaceholder
            t={t}
            displayAuthor={displayAuthor}
            onClick={() => setIsActive(true)}
          />
        )}
      </DiscussionComposerWrapper>
    </Loader>
  )
}

export default DialogComposer
