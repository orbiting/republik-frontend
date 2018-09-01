import React, { Component, Fragment } from 'react'
import { compose } from 'react-apollo'
import isEmail from 'validator/lib/isEmail'

import {
  Button, Field, Label, InlineSpinner, Interaction, A
} from '@project-r/styleguide'

import ErrorMessage from '../../../ErrorMessage'
import withT from '../../../../lib/withT'

const { H3 } = Interaction

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      error: false,
      isMutating: false,
      hideForm: true,
      mutationError: null,
      isUsed: props.campaign.slots.used > 0,
      dirty: {}
    }

    this.hasMutated = ({ data }) => {
      this.setState({
        isMutating: false,
        hideForm: true
      })
    }

    this.catchMutationError = error => {
      this.setState({
        isMutating: false,
        mutationError: error
      })
    }

    this.onClickReset = (event, value, shouldValidate) => {
      event.preventDefault()

      this.setState({
        value: '',
        hideForm: false,
        dirty: {}
      })
    }

    this.onChangeEmail = (event, value, shouldValidate) => {
      event.preventDefault()

      this.setState(() => ({
        value,
        error: (
          value.trim().length <= 0 &&
          this.props.t('Account/Access/Campaigns/Form/input/email/missing')
        ) || (
          !isEmail(value) &&
          this.props.t('Account/Access/Campaigns/Form/input/email/invalid')
        ),
        dirty: {
          email: shouldValidate
        }
      }))
    }

    this.onSubmit = (event) => {
      event.preventDefault()

      this.setState({
        isMutating: true,
        mutationError: false
      })

      return this.props.grantAccess({
        campaignId: this.props.campaign.id,
        email: this.state.value
      })
        .then(this.hasMutated)
        .catch(this.catchMutationError)
    }
  }

  render () {
    const { campaign, t } = this.props

    const {
      value,
      error = false,
      isMutating,
      mutationError,
      hideForm
    } = this.state

    const isUsed = campaign.slots.used > 0

    return (
      <form onSubmit={this.onSubmit}>
        {hideForm && isUsed
          ? (
            <Fragment>
              {campaign.slots.free > 0 &&
                <A href='#' onClick={this.onClickReset}>
                  {t('Account/Access/Campaigns/Form/reset')}
                </A>
              }
              {campaign.slots.total > 1 && campaign.slots.free < 1 &&
                <Label>
                  {t('Account/Access/Campaigns/Form/freeSlots/0')}
                </Label>
              }
            </Fragment>
          )
          : (
            <Fragment>
              <H3 style={{marginTop: 30}}>
                {t.pluralize(
                  'Account/Access/Campaigns/Form/title',
                  { count: campaign.slots.used }
                )}
              </H3>
              <Field
                name='email'
                type='email'
                label={t('Account/Access/Campaigns/Form/input/email/label')}
                error={error}
                onChange={this.onChangeEmail}
                value={value} />
              {isMutating
                ? <InlineSpinner />
                : <Button primary disabled={!!error || !value} onClick={this.onSubmit}>
                  {t('Account/Access/Campaigns/Form/button/submit')}
                </Button>
              }
              <br />
              {campaign.slots.free > 1 &&
                <Label>
                  {t.pluralize(
                    'Account/Access/Campaigns/Form/freeSlots',
                    { count: campaign.slots.free }
                  )}
                </Label>
              }
              {mutationError &&
                <ErrorMessage error={mutationError} />}
            </Fragment>
          )
        }
      </form>
    )
  }
}

export default compose(withT)(Form)
