import React, { Component, Fragment } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { withMembership } from '../Auth/checkRoles'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import ErrorMessage from '../ErrorMessage'
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

class ProgressSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mutating: false
    }

    this.catchServerError = error => {
      this.setState(() => ({
        mutating: false,
        serverError: error
      }))
    }
  }

  render () {
    const {
      t,
      isMember,
      me,
      revokeProgressConsent,
      submitProgressConsent
    } = this.props

    return (
      <Loader
        loading={!me}
        render={() => {
          const hasAccepted = me && me.progressConsent === true
          const { mutating, serverError } = this.state

          return (
            <Fragment>
              <P style={{ margin: '20px 0' }}>{getFeatureDescription(t)}</P>
              <Checkbox
                checked={hasAccepted}
                disabled={
                  (!isMember) ||
                  mutating
                }
                onChange={(_, checked) => {
                  this.setState({
                    mutating: true
                  })
                  const finish = () => {
                    this.setState({
                      mutating: false
                    })
                  }
                  const consentMutation = hasAccepted ? revokeProgressConsent : submitProgressConsent
                  consentMutation()
                    .then(finish)
                    .catch(this.catchServerError)
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
              {serverError && <ErrorMessage error={serverError} />}
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
  withT,
  withMe
)(ProgressSettings)
