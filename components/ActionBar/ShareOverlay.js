import React from 'react'

import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction,
  useColorContext
} from '@project-r/styleguide'

import { CloseIcon } from '@project-r/styleguide/icons'
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
}) => {
  const [colorScheme] = useColorContext()
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 400, minHeight: 0 }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {title}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<CloseIcon size={24} {...colorScheme.set('fill', 'text')} />}
        />
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
}

export default withT(ShareOverlay)
