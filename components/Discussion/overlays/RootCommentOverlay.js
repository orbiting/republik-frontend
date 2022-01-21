import React from 'react'
import { Overlay, OverlayBody, OverlayToolbar } from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'

import withT from '../../../lib/withT'
import DiscussionContextProvider from '../context/DiscussionContextProvider'
import Discussion from '../Discussion'

export const RootCommentOverlay = compose(
  withRouter,
  withT
)(({ t, router, discussionId, parent, onClose }) => (
  <Overlay onClose={onClose}>
    <OverlayToolbar title={t('RootCommentOverlay/title')} onClose={onClose} />
    <OverlayBody style={{ paddingTop: 58 }}>
      <DiscussionContextProvider discussionId={discussionId} parentId={parent}>
        <Discussion />
      </DiscussionContextProvider>
    </OverlayBody>
  </Overlay>
))
