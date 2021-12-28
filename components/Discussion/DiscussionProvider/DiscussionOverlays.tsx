import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { FeatureCommentOverlay } from '../FeatureCommentOverlay'
import { RootCommentOverlay } from '../RootCommentOverlay'
import { getFocusHref } from '../CommentLink'
import ShareOverlay from '../ShareOverlay'
import { DiscussionContext } from './context/DiscussionContext'

const DiscussionOverlays = () => {
  const router = useRouter()
  const {
    discussion,
    overlays: { shareOverlay }
  } = useContext(DiscussionContext)

  // TODO: Add discussion-preferences overlay

  return (
    <div>
      {/*featureComment && (
        <FeatureCommentOverlay
          discussion={discussion}
          comment={featureComment}
          onClose={() => {
            setFeatureComment()
          }}
        />
      )*/}

      {/*!!parent && (
        <RootCommentOverlay
          discussionId={discussion.id}
          parent={parent}
          onClose={() => {
            const href = getFocusHref(discussion)
            return href && router.push(href)
          }}
        />
      )*/}

      {shareOverlay.open && shareOverlay.data && (
        <ShareOverlay
          discussionId={discussion.id}
          onClose={() => {
            shareOverlay.handleClose()
          }}
          url={shareOverlay.data}
          title={discussion.title}
        />
      )}
    </div>
  )
}

export default DiscussionOverlays
