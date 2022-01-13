import React from 'react'

import ShareOverlay from '../../ShareOverlay'
import { useDiscussion } from '../context/DiscussionContext'
import { DiscussionPreferences } from '../../DiscussionPreferences'
import useDiscussionPreferences from '../hooks/useDiscussionPreferences'
import { useTranslation } from '../../../../lib/withT'
import { FeatureCommentOverlay } from '../../FeatureCommentOverlay'

const DiscussionOverlays = () => {
  const { t } = useTranslation()
  const {
    id,
    discussion,
    overlays: { shareOverlay, preferencesOverlay, featureOverlay }
  } = useDiscussion()
  const {
    preferences,
    loading,
    error,
    updateDiscussionPreferencesHandler
  } = useDiscussionPreferences(id)
  const noPreferences = discussion?.userPreference?.notifications === null
  const autoCredential =
    noPreferences &&
    !discussion?.userPreference?.anonymity &&
    preferences?.me?.credentials?.find(c => c.isListed)

  return (
    <>
      {preferencesOverlay.open && (
        <DiscussionPreferences
          t={t}
          discussionId={discussion.id}
          discussionPreferences={{
            ...preferences,
            loading,
            error
          }}
          setDiscussionPreferences={updateDiscussionPreferencesHandler}
          onClose={preferencesOverlay.handleClose}
          autoCredential={preferencesOverlay.data}
        />
      )}

      {featureOverlay.open && <FeatureCommentOverlay />}

      {shareOverlay.open && (
        <ShareOverlay
          discussionId={discussion.id}
          onClose={shareOverlay.handleClose}
          url={shareOverlay.data}
          title={discussion.title}
        />
      )}
    </>
  )
}

export default DiscussionOverlays
