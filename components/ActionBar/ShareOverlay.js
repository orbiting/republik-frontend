import React from 'react'

import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction
} from '@project-r/styleguide'

import { MdClose } from 'react-icons/md'

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
  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 400, minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {title}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
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
