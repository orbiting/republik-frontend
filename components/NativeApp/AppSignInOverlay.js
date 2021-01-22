import React, { useEffect, useContext, useState } from 'react'
import {
  Overlay,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction,
  OverlayBody,
  Button,
  useColorContext
} from '@project-r/styleguide'
import TokenAuthorization from '../Auth/TokenAuthorization'
import { DEFAULT_TOKEN_TYPE } from '../constants'
import * as base64u from '../../lib/utils/base64u'
import isEmail from 'validator/lib/isEmail'
import { MdClose } from 'react-icons/md'
import withT from '../../lib/withT'
import RawHtmlTranslation from '../RawHtmlTranslation'

const { H1, P } = Interaction

const knownTypes = [
  'email-confirmed',
  'invalid-email',
  'invalid-token',
  'session-denied',
  'token-authorization',
  'unavailable'
]

const AppSignInOverlay = ({ onClose, query, setQuery, t }) => {
  const [colorScheme] = useColorContext()
  const { context, token, tokenType, noAutoAuthorize } = query
  let { type, email } = query
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

  let title
  let content
  let isUnkownType

  if (type === 'token-authorization') {
    content = (
      <TokenAuthorization
        email={email}
        token={token}
        tokenType={tokenType || DEFAULT_TOKEN_TYPE}
        noAutoAuthorize={noAutoAuthorize}
        context={context}
        goTo={(type, email, context) => {
          if (type === 'email-confirmed') {
            onClose()
            return
          }
          setQuery({ type, email, context })
        }}
        onCloseAuthorization={onClose}
      />
    )
  } else {
    title = t.first(
      [`notifications/${type}/${context}/title`, `notifications/${type}/title`],
      undefined,
      ''
    )
    if (!title && !knownTypes.includes(type)) {
      title = t('notifications/unkown/title')
      isUnkownType = true
    }

    content = (
      <>
        <P>
          <RawHtmlTranslation
            first={[
              `notifications/${type}/${context}/text`,
              `notifications/${type}/text`
            ]}
            replacements={query}
            missingValue={isUnkownType ? t('notifications/unkown/text') : ''}
          />
        </P>
        <br />
        <br />
        <Button block primary onClick={onClose}>
          {t('notifications/closeButton/app')}
        </Button>
      </>
    )
  }

  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('AppSignInOverlay/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} {...colorScheme.set('fill', 'text')} />}
        />
      </OverlayToolbar>
      <OverlayBody>
        {title && (
          <>
            <H1>{title}</H1>
            <br />
          </>
        )}
        {content}
      </OverlayBody>
    </Overlay>
  )
}

export default withT(AppSignInOverlay)
