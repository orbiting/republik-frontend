import React, { useState } from 'react'
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
  Button,
  useColorContext,
  mediaQueries,
  CommentHeaderProfile
} from '@project-r/styleguide'

import { withDiscussionPreferences } from './graphql/enhancers/withDiscussionPreferences'
import { css } from 'glamor'

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
            me={me}
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

const styles = {
  previewWrapper: css({
    padding: 20,
    paddingTop: 20 + OverlayToolbar.height,
    '& > p': {
      marginTop: 0,
      marginBottom: 10
    }
  }),
  formWrapper: css({
    padding: 20,
    paddingTop: 0,
    // The iPhone X Space
    // - thank you Apple for overlaying websites
    paddingBottom: 120,
    [mediaQueries.mUp]: {
      paddingBottom: 20
    }
  }),
  fieldWrapper: css({
    marginBottom: 24,
    '& > *:not(:last-child)': {
      display: 'block',
      marginBottom: 12
    }
  })
}

const DiscussionPreferencesEditor = ({
  userPreference,
  autoCredential,
  t,
  credentials,
  rules,
  onClose,
  setDiscussionPreferences,
  me
}) => {
  const [colorScheme] = useColorContext()
  const [state, setState] = useState(
    getInitialState(userPreference, rules, autoCredential)
  )

  const handleSubmit = async formState => {
    try {
      await setDiscussionPreferences(formState.anonymity, formState.credential)
      onClose()
    } catch (error) {}
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
      <OverlayToolbar title='Dialog Teilnahme anpassen' onClose={onClose} />
      <OverlayBody noPadding>
        <div
          {...styles.previewWrapper}
          {...css({
            backgroundColor: colorScheme.getCSSColor('hover')
          })}
        >
          <Interaction.P>
            {t('components/DiscussionPreferences/profilePreview')}
          </Interaction.P>
          <div
            {...css({
              margin: '40 20'
            })}
          >
            <CommentHeaderProfile
              t={t}
              profilePicture={!state.anonymity && me.portrait}
              name={
                !state.anonymity
                  ? me.name
                  : t('discussion/displayUser/anonymous')
              }
              credential={{
                description: state.credential
              }}
            />
          </div>
        </div>
        <div {...styles.formWrapper}>
          {rules.anonymity !== 'FORBIDDEN' && (
            <div {...styles.fieldWrapper}>
              <Interaction.H2>
                {t('components/DiscussionPreferences/commentAnonymously')}
              </Interaction.H2>
              <Label>
                {t(
                  'components/DiscussionPreferences/commentAnonymously/description'
                )}
              </Label>
              <div>
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
              </div>
            </div>
          )}
          <div {...styles.fieldWrapper}>
            <Interaction.H2>Rolle definieren</Interaction.H2>
            <Label>
              {t('components/DiscussionPreferences/credential/description')}
            </Label>
            <Field
              label={t('components/DiscussionPreferences/credentialLabel')}
              value={state.credential}
              onChange={(_, val) => {
                setState(curr => ({
                  ...curr,
                  credential: val
                }))
              }}
            />
            {isListedCredential && state.anonymity && (
              <div style={{ marginBottom: 10 }}>
                <Label>
                  {t(
                    'components/DiscussionPreferences/credentialAnonymityWarning'
                  )}
                </Label>
              </div>
            )}
          </div>
          <Button type='submit'>
            {t('components/DiscussionPreferences/save')}
          </Button>
        </div>
      </OverlayBody>
    </form>
  )
}
