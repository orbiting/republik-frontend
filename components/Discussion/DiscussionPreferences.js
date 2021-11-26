import React, { useMemo, useState } from 'react'
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

/**
 * Get the initial-state of the discussion-preferences form.
 * @param userPreferences
 * @param rules
 * @param autoCredential
 * @returns {{credential: (*|null), anonymity: boolean}}
 */
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
    },
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(:last-child)': {
      marginBottom: 10
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
  }),
  suggestedCredentialsContainer: css({
    margin: '0 10',
    display: 'flex',
    flexDirection: 'column'
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
  const [
    showAllSuggestedCredentials,
    setShowAllSuggestedCredentials
  ] = useState(false)

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

  const previewData = useMemo(() => {
    const credentialInSuggestions = credentials.find(
      value => value.description === state.credential
    )

    return {
      credential: credentialInSuggestions || { description: state.credential },
      name: state.anonymity ? t('discussion/displayUser/anonymous') : me.name,
      portrait: !state.anonymity && me.portrait
    }
  }, [state.anonymity, state.credential, credentialSuggestions, me])

  const suggestedCredentialButtonStyling = useMemo(
    () =>
      css({
        all: 'unset',
        cursor: 'pointer',
        padding: 10,
        '@media(hover)': {
          ':hover': {
            backgroundColor: colorScheme.getCSSColor('hover')
          }
        },
        '&:not(:last-child)': {
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: colorScheme.getCSSColor('divider')
        }
      }),
    [colorScheme]
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
          <div
            {...styles.commentHeaderWrapper}
            {...colorScheme.set('backgroundColor', 'hover')}
          >
            <Label>
              {t('components/DiscussionPreferences/profilePreview')}
            </Label>
            <CommentHeaderProfile
              t={t}
              profilePicture={previewData.portrait}
              name={previewData.name}
              credential={previewData.credential}
            />
          </div>
        </div>
        <div {...styles.formWrapper}>
          {rules.anonymity !== 'FORBIDDEN' && (
            <div {...styles.fieldWrapper}>
              <Interaction.H3>
                {t('components/DiscussionPreferences/commentAnonymously')}
              </Interaction.H3>
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
            <Interaction.H3>
              {t('components/DiscussionPreferences/credentialHeading')}
            </Interaction.H3>
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
                <Label>
                  {t(
                    'components/DiscussionPreferences/existingCredentialLabel'
                  )}
                </Label>
                <div {...styles.suggestedCredentialsContainer}>
                  {credentialSuggestions
                    .slice(
                      0,
                      showAllSuggestedCredentials
                        ? credentialSuggestions.length - 1
                        : 4
                    )
                    .map(item => (
                      <button
                        key={item.description}
                        onClick={() =>
                          setState(curr => ({
                            ...curr,
                            credential: item.description
                          }))
                        }
                        {...suggestedCredentialButtonStyling}
                      >
                        <Credential
                          {...item}
                          textColor={colorScheme.getCSSColor('text')}
                        />
                      </button>
                    ))}
                </div>
                {!showAllSuggestedCredentials &&
                  credentialSuggestions.length >= 5 && (
                    <A
                      href='#'
                      onClick={() => setShowAllSuggestedCredentials(true)}
                    >
                      {t('components/DiscussionPreferences/showAllCredentials')}
                    </A>
                  )}
              </div>
            )}
          </div>
          <div
            {...css({
              width: '100%',
              [mediaQueries.mUp]: {
                maxWidth: 'max-content'
              }
            })}
          >
            <Button type='submit' block>
              {t('components/DiscussionPreferences/save')}
            </Button>
          </div>
        </div>
      </OverlayBody>
    </form>
  )
}
