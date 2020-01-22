import React from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm
} from '@project-r/styleguide'
import MdClose from 'react-icons/lib/md/close'
import Discussion from './Discussion'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

export const RootCommentOverlay = compose(withRouter)(
  ({ router, discussionId, parent, onClose }) => {
    return (
      <Overlay onClose={onClose}>
        <OverlayToolbar>
          <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
            Replies
          </Interaction.Emphasis>
          <OverlayToolbarConfirm
            onClick={onClose}
            label={<MdClose size={24} fill='#000' />}
          />
        </OverlayToolbar>
        <OverlayBody>
          <Discussion
            discussionId={discussionId}
            focusId={router.query.focus}
            parentId={parent}
            rootCommentOverlay
          />
        </OverlayBody>
      </Overlay>
    )
  }
)
