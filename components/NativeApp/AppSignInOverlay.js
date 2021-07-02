import React from 'react'
import {
  Overlay,
  OverlayToolbar,
  OverlayToolbarClose,
  Interaction,
  OverlayBody
} from '@project-r/styleguide'
import withT from '../../lib/withT'
import AuthNotification from '../Auth/Notification'

const AppSignInOverlay = ({ onClose, query, setQuery, t }) => (
  <Overlay onClose={onClose}>
    <OverlayToolbar>
      <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
        {t('AppSignInOverlay/title')}
      </Interaction.Emphasis>
      <OverlayToolbarClose onClick={onClose} />
    </OverlayToolbar>
    <OverlayBody>
      <AuthNotification
        query={query}
        onClose={onClose}
        goTo={(type, email, context) => {
          if (type === 'email-confirmed') {
            onClose()
            return
          }
          setQuery({ type, email, context })
        }}
      />
    </OverlayBody>
  </Overlay>
)

export default withT(AppSignInOverlay)
