import React from 'react'
import {
  Interaction,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  useColorContext
} from '@project-r/styleguide'
import { MdClose } from 'react-icons/md'
import Discussion from './Discussion'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import withT from '../../lib/withT'

export const RootCommentOverlay = compose(
  withRouter,
  withT
)(({ t, router, discussionId, parent, onClose }) => {
  const [colorScheme] = useColorContext()
  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('RootCommentOverlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} {...colorScheme.set('fill', 'text')} />}
        />
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
  )
})
