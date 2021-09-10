import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { flowRight as compose } from 'lodash'
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

class DiscussionPreferencesEditor extends PureComponent {
  constructor(props) {
    super(props)

    this.state = (() => {
      if (!props.userPreference) {
        return { anonymity: false, credential: null }
      }

      const { anonymity } = props.userPreference
      const credential = props.userPreference.credential || props.autoCredential
      return {
        anonymity,
        credential: credential ? credential.description : null
      }
    })()

    this.onChangeAnonymity = (_, anonymity) => {
      this.setState({ anonymity })
    }

    this.onSave = () => {
      const { onClose, setDiscussionPreferences } = this.props
      const { anonymity, credential } = this.state

      setDiscussionPreferences(anonymity, credential).then(
        () => {
          onClose()
        },
        e => {
          // ToDo Handle Error
          // console.warn(e)
        }
      )
    }
  }

  render() {
    const { t, credentials, rules, onClose } = this.props

    const anonymity = (() => {
      switch (rules.anonymity) {
        case 'ALLOWED':
          return {
            disabled: false,
            value: this.state.anonymity
          }
        case 'ENFORCED':
          return {
            disabled: true,
            value: true
          }
        case 'FORBIDDEN':
          return {
            disabled: true,
            value: false
          }
        default: {
          console.warn(
            `DiscussionPreferencesForm: unknown anonymity permission: ${rules.anonymity}`
          )
          return {
            disabled: true,
            value: false
          }
        }
      }
    })()

    const existingCredential = credentials.find(
      c => c.description === this.state.credential
    )
    const isListedCredential = existingCredential && existingCredential.isListed

    const credentialSuggestions = credentials.filter(
      c => c.description !== this.state.credential
    )

    return (
      <div>
        <OverlayToolbar onClose={onClose} />
        <OverlayBody>
          <Interaction.P>
            {t('components/DiscussionPreferences/explain')}
          </Interaction.P>
          <br />
          {(this.state.anonymity || rules.anonymity !== 'FORBIDDEN') && (
            <div style={{ marginBottom: 12 }}>
              <Checkbox
                disabled={anonymity.disabled}
                checked={anonymity.value}
                onChange={this.onChangeAnonymity}
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
            value={this.state.credential}
            onChange={(_, value) => {
              this.setState({ credential: value })
            }}
          />
          {isListedCredential && this.state.anonymity && (
            <div style={{ marginBottom: 10 }}>
              <Label>
                {t(
                  'components/DiscussionPreferences/credentialAnonymityWarning'
                )}
              </Label>
            </div>
          )}
          <Button onClick={this.onSave}>
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
      </div>
    )
  }
}
