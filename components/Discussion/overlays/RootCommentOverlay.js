import React from 'react'
import { Overlay, OverlayBody, OverlayToolbar } from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'

import withT from '../../../lib/withT'
import TempDiscussionComponent from '../DiscussionProvider'

export const RootCommentOverlay = compose(
  withRouter,
  withT
)(({ t, router, discussionId, parent, onClose }) => (
  <Overlay onClose={onClose}>
    <OverlayToolbar title={t('RootCommentOverlay/title')} onClose={onClose} />
    <OverlayBody style={{ paddingTop: 58 }}>
      <TempDiscussionComponent
        discussionId={discussionId}
        focusId={router.query.focus}
        parentId={parent}
        rootCommentOverlay
        includeParent
      />
    </OverlayBody>
  </Overlay>
))
