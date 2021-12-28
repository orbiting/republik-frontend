import React from 'react'

import ShareOverlay from '../../ShareOverlay'
import { useDiscussion } from '../context/DiscussionContext'

const DiscussionOverlays = () => {
  const {
    discussion,
    overlays: { shareOverlay }
  } = useDiscussion()

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

      {shareOverlay.open && (
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
