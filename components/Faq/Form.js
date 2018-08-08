import React, {Component} from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import isEmail from 'validator/lib/isEmail'
import AutosizeInput from 'react-textarea-autosize'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import {withSignOut} from '../Auth/SignOut'
import {withSignIn} from '../Auth/SignIn'
import ErrorMessage from '../ErrorMessage'
import FieldSet, {styles as fieldSetStyles} from '../FieldSet'

import Poller from '../Auth/Poller'

import {
  Interaction, InlineSpinner, Field, Button
} from '@project-r/styleguide'

import {H2} from './List'
const {P} = Interaction

const submitQuestion = gql`
mutation submitQuestion($question: String!) {
  submitQuestion(question: $question) {
    success
  }
}
`

class QuestionForm extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      loading: false,
      serverError: undefined,
      success: false,
      values: {},
      errors: {},
      dirty: {}
    }
  }
  handleEmail (value, shouldValidate, t) {
    this.setState(FieldSet.utils.mergeField({
      field: 'email',
      value,
      error: (
        (value.trim().length <= 0 && t('pledge/contact/email/error/empty')) ||
        (!isEmail(value) && t('pledge/contact/email/error/invalid'))
      ),
      dirty: shouldValidate
    }))
  }
  handleQuestion (value, shouldValidate, t) {
    this.setState(FieldSet.utils.mergeField({
      field: 'question',
      value,
      error: (
        value.trim().length <= 5 && t('faq/form/question/error')
      ),
      dirty: shouldValidate
    }))
  }
  checkUserFields ({me, t}) {
    const defaultValues = {
      email: (me && me.email) || ''
    }
    const values = {
      ...defaultValues,
      ...this.state.values
    }
    this.handleEmail(values.email, false, t)
  }
  send (newTokenType) {
    const {me} = this.props
    const {values} = this.state

    this.setState(() => ({
      loading: true,
      success: false,
      serverError: undefined
    }))

    const catchError = error => {
      this.setState(() => ({
        loading: false,
        serverError: error
      }))
    }

    if (me && me.email !== values.email) {
      this.props.signOut().then(() => {
        this.send()
      }).catch(catchError)
      return
    }

    if (!me) {
      this.props.signIn(values.email, 'faq', undefined, newTokenType)
        .then(({data}) => {
          this.setState(() => ({
            polling: true,
            signInResponse: data.signIn
          }))
        })
        .catch(catchError)
      return
    }

    this.props
      .mutate({ variables: { question: values.question } })
      .then(() => {
        this.setState((state) => ({
          loading: false,
          success: true,
          values: {
            ...state.values,
            question: ''
          }
        }))
      })
      .catch(error => {
        this.setState(() => ({
          loading: false,
          serverError: error
        }))
      })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.me !== this.props.me) {
      this.checkUserFields(nextProps)
    }
  }
  componentDidMount () {
    this.checkUserFields(this.props)
    this.handleQuestion(
      this.state.values.question || '',
      false,
      this.props.t
    )
  }
  render () {
    const {t} = this.props

    const {
      dirty, values, errors,
      success,
      polling, signInResponse,
      loading, serverError
    } = this.state

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .filter(Boolean)

    return (
      <div>
        <H2>{t('faq/form/title')}</H2>
        <form onSubmit={event => {
          event.preventDefault()
          if (errorMessages.length) {
            this.setState((state) => ({
              dirty: {
                email: true,
                question: true
              }
            }))
            return
          }
          this.send()
        }}>
          <Field label={t('pledge/contact/email/label')}
            name='email'
            type='email'
            error={dirty.email && errors.email}
            value={values.email}
            onChange={(_, value, shouldValidate) => {
              this.handleEmail(value, shouldValidate, t)
            }} />
          <br />
          <Field label={t('faq/form/question/label')}
            name='question'
            renderInput={({ref, ...inputProps}) => (
              <AutosizeInput
                {...inputProps}
                {...fieldSetStyles.autoSize}
                inputRef={ref} />
            )}
            error={dirty.question && errors.question}
            value={values.question}
            onChange={(_, value, shouldValidate) => {
              this.handleQuestion(value, shouldValidate, t)
            }} />
          <br /><br />
          {loading
            ? <InlineSpinner />
            : (
              <div style={{opacity: errorMessages.length ? 0.5 : 1}}>
                <Button type='submit'>
                  {t('faq/form/question/submit')}
                </Button>
              </div>
            )
          }

          {!!polling && (
            <Poller
              tokenType={signInResponse.tokenType}
              phrase={signInResponse.phrase}
              email={values.email}
              alternativeFirstFactors={signInResponse.alternativeFirstFactors}
              onCancel={() => {
                this.setState(() => ({
                  polling: false,
                  loading: false
                }))
              }}
              onTokenTypeChange={(altTokenType) => {
                this.send(altTokenType)
              }}
              onSuccess={(me) => {
                this.setState(() => ({
                  polling: false
                }))
                this.send()
              }} />
          )}
          {!!serverError && <ErrorMessage error={serverError} />}
          {!!success && <div style={{marginTop: 20}}>
            <Interaction.H3>
              {t('faq/form/merci/title')}
            </Interaction.H3>
            <P>
              {t('faq/form/merci/text')}
            </P>
          </div>}
        </form>
      </div>
    )
  }
}

export default compose(
  graphql(submitQuestion),
  withSignOut,
  withSignIn,
  withMe,
  withT
)(QuestionForm)
