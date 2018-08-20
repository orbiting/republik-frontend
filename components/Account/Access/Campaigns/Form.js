import React, { Component, Fragment } from 'react'
import isEmail from 'validator/lib/isEmail'

import { Button, Field, Label, InlineSpinner, Interaction, A } from '@project-r/styleguide'

import { timeFormat } from '../../../../lib/utils/format'

import ErrorMessage from '../../../ErrorMessage'

const { H3, P } = Interaction

const dayFormat = timeFormat('%e. %B %Y')

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      error: false,
      isMutating: false,
      hasMutated: false,
      mutationError: null,
      dirty: {},
      grantedLast: {}
    }

    this.hasMutated = ({ data }) => {
      this.setState({
        isMutating: false,
        hasMutated: true,
        grantedLast: {
          email: data.grantAccess.email,
          endAt: data.grantAccess.endAt
        }
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
        hasMutated: false,
        dirty: {}
      })
    }

    this.onChangeEmail = (event, value, shouldValidate) => {
      event.preventDefault()

      this.setState(() => ({
        value,
        error: (
          value.trim().length <= 0 &&
          'Keine E-Mail-Adresse angegeben'
        ) || (
          !isEmail(value) &&
          'Keine gültige E-Mail-Adresse erkannt'
        ),
        dirty: {
          email: shouldValidate
        }
      }))
    }

    this.onSubmit = async (event) => {
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
    const { campaign } = this.props

    if (campaign.slots.free === 0) {
      if (campaign.slots.total > 1) {
        return (
          <Label>Alle verfügbaren Zugriffe vergeben.</Label>
        )
      }

      return null
    }

    const {
      value,
      error = false,
      isMutating,
      mutationError,
      hasMutated,
      grantedLast
    } = this.state

    return (
      <form onSubmit={this.onSubmit}>
        {campaign.slots.used < 1
          ? <H3 style={{marginTop: 30}}>Zugriff vergeben</H3>
          : <H3 style={{marginTop: 30}}>Einen weiteren Zugriff vergeben</H3>
        }
        {hasMutated
          ? (
            <Fragment>
              <P>
                Zäck boom. Zugriff an <strong>{grantedLast.email}</strong>
                vergeben, der gültig ist bis zum
                <strong>{dayFormat(new Date(grantedLast.endAt))}</strong>.
              </P>
              {campaign.slots.free > 0 &&
                <A href='#' onClick={this.onClickReset}>weiteren Zugriff vergeben</A>
              }
            </Fragment>
          )
          : (
            <Fragment>
              <P>
                Geben Sie die E-Mail-Adresse von der Person an, der Sie Zugriff
                vergeben möchten. Der Empfänger erhält eine E-Mail. Er
                kann in der recht freundliche Einladungs-E-Mail und seinem Konto
                erkennen, dass Sie einen Zugriff mit ihm teilen.
              </P>
              <Field
                name='email'
                type='email'
                label='E-Mail-Adresse'
                error={error}
                onChange={this.onChangeEmail}
                value={value} />
              {isMutating
                ? <InlineSpinner />
                : <Button primary disabled={!!error || !value} onClick={this.onSubmit}>
                  Teilen
                </Button>
              }
              <br />
              {campaign.slots.free > 1 &&
                <Label>noch {campaign.slots.free} Zugriffe übrig</Label>
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

export default Form
