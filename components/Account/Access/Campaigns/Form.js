import React, { Component, Fragment } from 'react'
import isEmail from 'validator/lib/isEmail'

import { Button, Field, Label, InlineSpinner, Interaction, A } from '@project-r/styleguide'

import ErrorMessage from '../../../ErrorMessage'

const { H3 } = Interaction

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      error: false,
      isMutating: false,
      hasMutated: false,
      mutationError: null,
      isUsed: props.campaign.slots.used > 0,
      dirty: {}
    }

    this.hasMutated = ({ data }) => {
      this.setState({
        isMutating: false,
        hasMutated: true
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

    const {
      value,
      error = false,
      isMutating,
      mutationError,
      hasMutated
    } = this.state

    const isUsed = campaign.slots.used > 0

    return (
      <form onSubmit={this.onSubmit}>
        {hasMutated && isUsed
          ? (
            <Fragment>
              {campaign.slots.free > 0 &&
                <A href='#' onClick={this.onClickReset}>
                  weiteren Zugriff vergeben
                </A>
              }
              {campaign.slots.total > 1 && campaign.slots.free < 1 &&
                <Label>Alle verfügbaren Zugriffe vergeben.</Label>
              }
            </Fragment>
          )
          : (
            <Fragment>
              {campaign.slots.used < 1
                ? <H3 style={{marginTop: 30}}>Zugriff vergeben</H3>
                : <H3 style={{marginTop: 30}}>
                  Einen weiteren Zugriff vergeben
                </H3>
              }
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
                <Label>noch {campaign.slots.free} Plätze übrig</Label>
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
