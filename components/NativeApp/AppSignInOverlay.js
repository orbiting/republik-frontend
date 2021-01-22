import React, { useEffect, useContext, useState } from 'react'
import {
  Overlay,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction,
  OverlayBody,
  useColorContext
} from '@project-r/styleguide'
import TokenAuthorization from '../Auth/TokenAuthorization'
import { DEFAULT_TOKEN_TYPE } from '../constants'
import * as base64u from '../../lib/utils/base64u'
import isEmail from 'validator/lib/isEmail'
import { MdClose } from 'react-icons/md'
import withT from '../../lib/withT'

const AppSignInOverlay = ({ closeSignInOverlay, signInData, t }) => {
  const [colorScheme] = useColorContext()
  const { context, token, tokenType, noAutoAuthorize } = signInData
  let { email, type } = signInData
  if (email !== undefined) {
    try {
      if (base64u.match(email)) {
        email = base64u.decode(email)
      }
    } catch (e) {}

    if (!isEmail(email)) {
      type = 'invalid-email'
      email = ''
    }
  }
  return (
    <Overlay onClose={() => closeSignInOverlay()}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('AppSignInOverlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={() => closeSignInOverlay()}
          label={<MdClose size={24} {...colorScheme.set('fill', 'text')} />}
        />
      </OverlayToolbar>
      <OverlayBody>
        <TokenAuthorization
          email={email}
          token={token}
          tokenType={tokenType || DEFAULT_TOKEN_TYPE}
          noAutoAuthorize={noAutoAuthorize}
          context={context}
          onCloseAuthorization={() => closeSignInOverlay()}
        />
      </OverlayBody>
    </Overlay>
  )
}

export default withT(AppSignInOverlay)
