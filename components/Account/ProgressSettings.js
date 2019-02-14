import React, { Component, Fragment } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { withMembership } from '../Auth/checkRoles'
import withT from '../../lib/withT'

import { P } from './Elements'
import { Loader, InlineSpinner, Checkbox } from '@project-r/styleguide'

import { getFeatureDescription } from '../Article/Progress/ProgressPrompt'
import { withProgressApi } from '../Article/Progress/api'

const styles = {
  headline: css({
    margin: '80px 0 30px 0'
  }),
  spinnerWrapper: css({
    display: 'inline-block',
    height: 0,
    marginLeft: 15,
    verticalAlign: 'middle',
    '& > span': {
      display: 'inline'
    }
  }),
  label: css({
    display: 'block',
    paddingLeft: '28px'
  })
}

const ErrorContainer = ({ children }) => (
  <div style={{ marginTop: 20 }}>{children}</div>
)

class ProgressSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mutating: {}
    }
  }

  render () {
    const {
      t,
      isMember,
      data: { loading, error },
      myProgressConsent,
      revokeConsent,
      submitConsent
    } = this.props

    return (
      <Loader
        loading={loading}
        error={error}
        ErrorContainer={ErrorContainer}
        render={() => {
          const hasAccepted = myProgressConsent && myProgressConsent.hasConsentedTo === true
          const { mutating } = this.state

          return (
            <Fragment>
              <P style={{ margin: '20px 0' }}>{getFeatureDescription(t)}</P>
              <Checkbox
                checked={hasAccepted}
                disabled={
                  (!isMember) ||
                  mutating['consent']
                }
                onChange={(_, checked) => {
                  this.setState(state => ({
                    mutating: {
                      ...state.mutating,
                      'consent': true
                    }
                  }))
                  const finish = () => {
                    this.setState(state => ({
                      mutating: {
                        ...state.mutating,
                        'consent': false
                      }
                    }))
                  }
                  const consentMutation = hasAccepted ? revokeConsent : submitConsent
                  consentMutation().then(finish)
                }}
              >
                <span {...styles.label}>
                  {t('account/progress/consent/label')}
                  {mutating['consent'] && (
                    <span {...styles.spinnerWrapper}>
                      <InlineSpinner size={24} />
                    </span>
                  )}
                </span>
              </Checkbox>
            </Fragment>
          )
        }}
      />
    )
  }
}

export default compose(
  withProgressApi,
  withMembership,
  withT
)(ProgressSettings)
