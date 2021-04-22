import React from 'react'
import {
  Overlay,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction,
  OverlayBody,
  useColorContext
} from '@project-r/styleguide'
import { CloseIcon } from '@project-r/styleguide/icons'
import withT from '../../lib/withT'
import AuthNotification from '../Auth/Notification'

const AppSignInOverlay = ({ onClose, query, setQuery, t }) => {
  const [colorScheme] = useColorContext()

  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('AppSignInOverlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<CloseIcon size={24} {...colorScheme.set('fill', 'text')} />}
        />
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
}

export default withT(AppSignInOverlay)
