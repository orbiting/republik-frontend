import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'
import withT from '../../lib/withT'
import {
  Loader,
  Field,
  Checkbox,
  Overlay,
  OverlayToolbar,
  OverlayBody,
  Interaction,
  Label,
  A,
  Button
} from '@project-r/styleguide'

import { withDiscussionPreferences } from './graphql/enhancers/withDiscussionPreferences'
import Credential from '../Credential'

export const DiscussionPreferences = ({
  t,
  onClose,
  discussionPreferences: { loading, error, me, discussion },
  setDiscussionPreferences,
  autoCredential
}) => (
  <Overlay onClose={onClose} mUpStyle={{ minHeight: 240 }}>
    <Loader
      loading={loading}
      error={error}
      message={t('components/DiscussionPreferences/loading')}
      render={() => {
        const { credentials } = me
        const { rules, userPreference } = discussion

        return (
          <DiscussionPreferencesEditor
            t={t}
            credentials={credentials}
            rules={rules}
            autoCredential={autoCredential}
            userPreference={userPreference}
            onClose={onClose}
            setDiscussionPreferences={setDiscussionPreferences}
          />
        )
      }}
    />
  </Overlay>
)

DiscussionPreferences.propTypes = {
  discussionId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  discussionPreferences: PropTypes.object.isRequired,
  setDiscussionPreferences: PropTypes.func.isRequired
}

export default compose(withT, withDiscussionPreferences)(DiscussionPreferences)

function getInitialState(
  userPreferences = {},
  rules = {},
  autoCredential = null
) {
  let { anonymity = false, credential = autoCredential } = userPreferences

  switch (rules.anonymity) {
    case 'ALLOWED':
      // when allowed keep state given in userPreferences
      break
    case 'FORBIDDEN':
      anonymity = false
      break
    case 'ENFORCED':
      anonymity = true
      break
    default:
      console.warn(
        `DiscussionPreferencesForm: unknown anonymity permission: ${rules.anonymity}`
      )
      anonymity = false
      break
  }

  return {
    anonymity,
    credential: credential ? credential.description : null
  }
}

const DiscussionPreferencesEditor = ({
  userPreference,
  autoCredential,
  t,
  credentials,
  rules,
  onClose,
  setDiscussionPreferences
}) => {
  const [state, setState] = useState(
    getInitialState(userPreference, rules, autoCredential)
  )
  const [error, setError] = useState(null)

  const handleSubmit = async formState => {
    try {
      await setDiscussionPreferences(formState.anonymity, formState.credential)
      onClose()
    } catch (error) {
      setError('Error submitting discussion preferences')
    }
  }

  const existingCredential = credentials.find(
    c => c.description === state.credential
  )
  const isListedCredential = existingCredential && existingCredential.isListed

  const credentialSuggestions = credentials.filter(
    c => c.description !== state.credential
  )

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        handleSubmit(state)
      }}
    >
      <OverlayToolbar onClose={onClose} />
      <OverlayBody>
        <Interaction.P>
          {t('components/DiscussionPreferences/explain')}
        </Interaction.P>
        <br />
        {(state.anonymity || rules.anonymity !== 'FORBIDDEN') && (
          <div style={{ marginBottom: 12 }}>
            <Checkbox
              /*
               Possible anonymity rules are 
               ['ALLOWED', 'ENFORCED', 'FORBIDDEN']
               THe checkbox should only be enabled if the rule is 'ALLOWED'
               */
              disabled={rules?.anonymity !== 'ALLOWED'}
              checked={state.anonymity}
              onChange={(_, val) => {
                setState(curr => ({
                  ...curr,
                  anonymity: val
                }))
              }}
            >
              {t('components/DiscussionPreferences/commentAnonymously')}
            </Checkbox>
            <br style={{ clear: 'both' }} />
            <Label>
              {t(
                'components/DiscussionPreferences/commentAnonymously/disclaimer'
              )}
            </Label>
          </div>
        )}

        <Field
          label={t('components/DiscussionPreferences/credentialLabel')}
          value={state.credential}
          onChange={(_, value) => {
            setState(curr => ({
              ...curr,
              credential: value
            }))
          }}
        />
        {isListedCredential && this.state.anonymity && (
          <div style={{ marginBottom: 10 }}>
            <Label>
              {t('components/DiscussionPreferences/credentialAnonymityWarning')}
            </Label>
          </div>
        )}
        <Button type='submit'>
          {t('components/DiscussionPreferences/save')}
        </Button>
        <Interaction.P>
          {!!credentialSuggestions.length && (
            <Label style={{ display: 'block', margin: '20px 0 5px 0' }}>
              {t('components/DiscussionPreferences/existingCredentialLabel')}
            </Label>
          )}
          {credentialSuggestions.map(c => (
            <A
              key={c.description}
              href='#use'
              style={{ display: 'block' }}
              onClick={e => {
                e.preventDefault()
                this.setState({ credential: c.description })
              }}
            >
              <Credential {...c} />
            </A>
          ))}
        </Interaction.P>
      </OverlayBody>
    </form>
  )
}
