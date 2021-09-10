import React from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarClose
} from '@project-r/styleguide'
import Discussion from './Discussion'
import { flowRight as compose } from 'lodash'
import { withRouter } from 'next/router'

import withT from '../../lib/withT'

export const RootCommentOverlay = compose(
  withRouter,
  withT
)(({ t, router, discussionId, parent, onClose }) => (
  <Overlay onClose={onClose}>
    <OverlayToolbar title={t('RootCommentOverlay/title')} onClose={onClose} />
    <OverlayBody style={{ paddingTop: 58 }}>
      <Discussion
        discussionId={discussionId}
        focusId={router.query.focus}
        parentId={parent}
        rootCommentOverlay
        includeParent
      />
    </OverlayBody>
  </Overlay>
))
