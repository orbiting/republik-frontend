import React from 'react'

import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarClose,
  Interaction
} from '@project-r/styleguide'

import withT from '../../lib/withT'
import ShareButtons from './ShareButtons'

const ShareOverlay = ({
  title,
  url,
  tweet,
  emailSubject,
  emailBody,
  emailAttachUrl,
  onClose
}) => (
  <Overlay onClose={onClose} mUpStyle={{ maxWidth: 400, minHeight: 0 }}>
    <OverlayToolbar>
      <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
        {title}
      </Interaction.Emphasis>
      <OverlayToolbarClose onClick={onClose} />
    </OverlayToolbar>
    <OverlayBody>
      <div style={{ textAlign: 'center' }}>
        <ShareButtons
          onClose={onClose}
          url={url}
          tweet={tweet}
          grid
          emailSubject={emailSubject}
          emailBody={emailBody}
          emailAttachUrl={emailAttachUrl}
          eventCategory='ShareOverlay'
        />
      </div>
    </OverlayBody>
  </Overlay>
)

export default withT(ShareOverlay)
