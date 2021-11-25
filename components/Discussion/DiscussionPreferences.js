import React, { useState } from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'
import withT from '../../lib/withT'
import {
  A,
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
    paddingBottom: 0,
    borderBottom: '1px solid',
    [mediaQueries.mUp]: {
      paddingBottom: 20
    },
    '& > p': {
      marginTop: 0,
      marginBottom: 10
    }
  }),
  commentHeaderWrapper: css({
    margin: '0px -20px',
    padding: 20,
    [mediaQueries.mUp]: {
      margin: 0
    }
  }),
  formWrapper: css({
    marginTop: 20,
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
      marginBottom: 10
    }
  }),
  suggestedCredentialsWrapper: css({
    '& > *:not(:last-child)': {
      marginBottom: 10
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
      <OverlayToolbar
        title={t('components/DiscussionPreferences/modalTitle')}
        onClose={onClose}
      />
      <OverlayBody noPadding>
        <div
          {...styles.previewWrapper}
          {...colorScheme.set('borderBottomColor', 'divider')}
        >
          <Interaction.P>
            {t('components/DiscussionPreferences/profilePreview')}
          </Interaction.P>
          <div
            {...styles.commentHeaderWrapper}
            {...colorScheme.set('backgroundColor', 'hover')}
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
            <Interaction.H2>
              {t('components/DiscussionPreferences/credentialHeading')}
            </Interaction.H2>
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
            {credentialSuggestions && (
              <div {...styles.suggestedCredentialsWrapper}>
                <Interaction.H3>
                  {t(
                    'components/DiscussionPreferences/existingCredentialLabel'
                  )}
                </Interaction.H3>
                <div style={{ marginLeft: 10 }}>
                  {credentialSuggestions.map(item => (
                    <div
                      key={item.description}
                      {...css({
                        padding: '10px 0',
                        '&:not(:last-child)': {
                          borderBottom: '1px solid',
                          borderBottomColor: colorScheme.getCSSColor('divider')
                        },
                        '&:hover': {
                          backgroundColor: colorScheme.getCSSColor('alert')
                        }
                      })}
                    >
                      <A
                        href='#'
                        style={{ display: 'block' }}
                        onClick={() =>
                          setState(curr => ({
                            ...curr,
                            credential: item.description
                          }))
                        }
                      >
                        <Credential {...item} />
                      </A>
                    </div>
                  ))}
                </div>
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
