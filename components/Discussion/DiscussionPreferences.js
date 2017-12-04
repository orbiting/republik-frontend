import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import {
  Field,
  Dropdown,
  Checkbox,
  Overlay,
  OverlayToolbar,
  OverlayToolbarClose,
  OverlayToolbarConfirm,
  OverlayBody
} from '@project-r/styleguide'
import Loader from '../Loader'
import { withDiscussionPreferences, withSetDiscussionPreferences } from './enhancers'

export const DiscussionPreferences = ({t, data: {loading, error, me, discussion}, onClose, setDiscussionPreferences}) => (
  <Overlay onClose={onClose}>
    <Loader
      loading={loading}
      error={error}
      message={t('components/DiscussionPreferences/loading')}
      render={() => {
        const {publicUser: {credentials}} = me
        const {rules, userPreference} = discussion

        return (
          <DiscussionPreferencesEditor
            t={t}
            credentials={credentials}
            rules={rules}
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
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  setDiscussionPreferences: PropTypes.func.isRequired
}

export default compose(
  withT,
  withDiscussionPreferences,
  withSetDiscussionPreferences
)(DiscussionPreferences)

class DiscussionPreferencesEditor extends PureComponent {
  constructor (props) {
    super(props)

    this.state = (() => {
      if (!props.userPreference) {
        return {anonymity: false, credential: null}
      }

      const {anonymity, credential} = props.userPreference
      return {
        anonymity,
        credential: credential ? credential.description : null
      }
    })()

    this.onChangeAnonymity = (_, anonymity) => {
      this.setState({anonymity})
    }

    this.onSave = () => {
      const {onClose, setDiscussionPreferences} = this.props
      const {anonymity, credential} = this.state

      setDiscussionPreferences(anonymity, credential).then(
        () => {
          onClose()
        },
        (e) => {
          console.error(e)
        }
      )
    }
  }

  render () {
    const {t, credentials, rules, onClose} = this.props

    const anonymity = (() => {
      switch (rules.anonymity) {
        case 'ALLOWED': return {
          disabled: false,
          value: this.state.anonymity
        }
        case 'ENFORCED': return {
          disabled: true,
          value: true
        }
        case 'FORBIDDEN': return {
          disabled: true,
          value: false
        }
        default: {
          console.warn(`DiscussionPreferencesForm: unknown anonymity permission: ${rules.anonymity}`)
          return {
            disabled: true,
            value: false
          }
        }
      }
    })()

    const descriptionOptions = credentials.map(cred => ({
      value: cred.description,
      text: cred.description
    }))

    // Append the credential string to the options if it doesn't appear in them
    // (ie. user has entered a new one into the input field).
    if (descriptionOptions.indexOf(item => item.text === this.state.credential) === -1) {
      descriptionOptions.push({
        value: this.state.credential,
        text: this.state.credential
      })
    }

    return (
      <div>
        <OverlayToolbar>
          <OverlayToolbarClose onClick={onClose} />
          <OverlayToolbarConfirm label={t('components/DiscussionPreferences/save')} onClick={this.onSave} />
        </OverlayToolbar>

        <OverlayBody>
          <div style={{marginBottom: 12}}>
            <Checkbox
              disabled={anonymity.disabled}
              checked={anonymity.value}
              onChange={this.onChangeAnonymity}
            >
              {t('components/DiscussionPreferences/commentAnonymously')}
            </Checkbox>
          </div>

          <Dropdown
            label={t('components/DiscussionPreferences/credentialLabel')}
            items={descriptionOptions}
            value={this.state.credential}
            onChange={(item) => {
              this.setState({credential: item.value})
            }}
          />

          <Field
            label={t('components/DiscussionPreferences/newCredentialLabel')}
            value={this.state.credential}
            onChange={(_, value) => { this.setState({credential: value}) }}
          />
        </OverlayBody>
      </div>
    )
  }
}
