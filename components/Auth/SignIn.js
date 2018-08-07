import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {css} from 'glamor'
import isEmail from 'validator/lib/isEmail'

import { Router, Link } from '../../lib/routes'
import withT from '../../lib/withT'

import ErrorMessage from '../ErrorMessage'
import RawHtmlElements from '../RawHtmlElements'

import {
  Button,
  InlineSpinner,
  Interaction,
  Field,
  Label,
  colors,
  linkRule
} from '@project-r/styleguide'

import Poller from './Poller'

const {P} = Interaction

const styles = {
  form: css({
    display: 'flex',
    justifyContent: 'space-between',
    flexFlow: 'row wrap'
  }),
  input: css({
    marginRight: 10,
    marginBottom: 0,
    width: '58%',
    flexGrow: 1
  }),
  button: css({
    width: 160,
    textAlign: 'center',
    marginBottom: 15
  }),
  hint: css({
    marginTop: -5,
    color: colors.lightText,
    display: 'block',
    lineHeight: '20px'
  }),
  hintA: css({
    textDecoration: 'underline',
    textDecorationSkip: 'ink',
    color: colors.lightText,
    ':hover': {
      color: colors.text
    }
  })
}

class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: props.email || '',
      polling: false,
      loading: false,
      success: undefined,
      cookiesEnabled: true
    }
  }

  componentDidMount () {
    this.setState({ cookiesEnabled: navigator.cookieEnabled })
  }

  render () {
    const {t, label} = this.props
    const {
      polling, phrase, loading, success, cookiesEnabled,
      error, dirty, email,
      serverError
    } = this.state

    if (polling) {
      return (
        <P>
          <RawHtmlElements t={t} translationKey='signIn/polling' replacements={{
            phrase: <b key='phrase'>{phrase}</b>,
            email: <b key='email'>{email}</b>,
            link: (
              <a {...linkRule}
                key='cancel'
                style={{cursor: 'pointer'}}
                onClick={(e) => {
                  e.preventDefault()
                  this.setState(() => ({
                    polling: false
                  }))
                  Router.pushRoute('signin')
                }}
              >{t('signIn/polling/link')}</a>
            )
          }} />
          <Poller onSuccess={(me, ms) => {
            this.setState(() => ({
              polling: false,
              success: t('signIn/success', {
                nameOrEmail: me.name || me.email,
                seconds: Math.round(ms / 1000)
              })
            }))
          }} />
        </P>
      )
    }

    if (success) {
      return <span>{success}</span>
    }

    if (!cookiesEnabled) {
      return (
        <P>
          <ErrorMessage error={t('cookies/disabled/error')} />
          <RawHtmlElements
            t={t}
            translationKey='cookies/disabled/error/explanation'
          />
        </P>
      )
    }

    const submitForm = (event) => {
      event.preventDefault()
      if (error) {
        this.setState(() => ({
          dirty: true
        }))
        return
      }
      if (loading) {
        return
      }
      this.setState(() => ({
        loading: true
      }))
      this.props.signIn(email, this.props.context, this.props.acceptedConsents)
        .then(({data}) => {
          this.setState(() => ({
            polling: true,
            loading: false,
            phrase: data.signIn.phrase
          }))
        })
        .catch(error => {
          this.setState(() => ({
            serverError: error,
            loading: false
          }))
        })
    }

    return (
      <div>
        <form onSubmit={submitForm}>
          <div {...styles.form}>
            <div {...styles.input}>
              <Field
                name='email'
                type='email'
                label={t('signIn/email/label')}
                error={dirty && error}
                onChange={(_, value, shouldValidate) => {
                  this.setState(() => ({
                    email: value,
                    error: (
                      (value.trim().length <= 0 && t('signIn/email/error/empty')) ||
                      (!isEmail(value) && t('signIn/email/error/invalid'))
                    ),
                    dirty: shouldValidate
                  }))
                }}
                value={email} />
            </div>
            <div {...styles.button}>
              {loading ? <InlineSpinner /> : <Button
                block
                type='submit'
                disabled={loading}>{label || t('signIn/button')}</Button>}
            </div>
          </div>
        </form>
        <Label {...styles.hint}>
          <Link route='legal/privacy'>
            <a {...styles.hintA}>{t('signIn/privacy')}</a>
          </Link>
          {' – '}
          <Link route='faq'>
            <a {...styles.hintA}>{t('signIn/faq')}</a>
          </Link>
          {' – '}
          {t('signIn/hint')}
        </Label>
        {!!serverError && <ErrorMessage error={serverError} />}
      </div>
    )
  }
}

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired
}

const signInMutation = gql`
mutation signIn($email: String!, $context: String, $consents: [String!]) {
  signIn(email: $email, context: $context, consents: $consents) {
    phrase
  }
}
`

export const withSignIn = graphql(signInMutation, {
  props: ({mutate}) => ({
    signIn: (email, context = 'signIn', consents) =>
      mutate({variables: {email, context, consents}})
  })
})

export default compose(
  withSignIn,
  withT
)(SignIn)
