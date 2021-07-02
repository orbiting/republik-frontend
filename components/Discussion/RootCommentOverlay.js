import React from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarClose
} from '@project-r/styleguide'
import Discussion from './Discussion'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import withT from '../../lib/withT'

export const RootCommentOverlay = compose(
  withRouter,
  withT
)(({ t, router, discussionId, parent, onClose }) => (
  <Overlay onClose={onClose}>
    <OverlayToolbar>
      <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
        {t('RootCommentOverlay/title')}
      </Interaction.Emphasis>
      <OverlayToolbarClose onClick={onClose} />
    </OverlayToolbar>
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
