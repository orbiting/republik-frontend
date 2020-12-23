import React, { useEffect, useContext, useState } from 'react'
import { graphql, compose } from 'react-apollo'
import {
  Overlay,
  OverlayToolbar,
  OverlayToolbarClose,
  OverlayBody
} from '@project-r/styleguide'
import TokenAuthorization from '../Auth/TokenAuthorization'
import { DEFAULT_TOKEN_TYPE } from '../constants'
import * as base64u from '../../lib/utils/base64u'
import isEmail from 'validator/lib/isEmail'

const AppSignInOverlay = ({ closeSignInOverlay, signInData }) => {
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
        <OverlayToolbarClose onClick={() => closeSignInOverlay()} />
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

export default AppSignInOverlay
