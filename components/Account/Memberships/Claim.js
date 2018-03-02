import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Loader from '../../Loader'
import RawHtmlElements from '../../RawHtmlElements'
import ErrorMessage from '../../ErrorMessage'
import { gotoMerci } from '../../Pledge/Merci'

import { Link } from '../../../lib/routes'
import withT from '../../../lib/withT'
import withMe, { meQuery } from '../../../lib/apollo/withMe'
import { validate as isEmail } from 'isemail'

import Poller from '../../Auth/Poller'
import FieldSet from '../../FieldSet'

import { withSignOut } from '../../Auth/SignOut'
import { withSignIn } from '../../Auth/SignIn'

import {
  Field, Button, Checkbox, Interaction,
  RawHtml, colors, linkRule
} from '@project-r/styleguide'

const {H2, P} = Interaction

class ClaimMembership extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      serverError: undefined,
      legal: false,
      values: {},
      errors: {},
      dirty: {}
    }
  }
  handleFirstName (value, shouldValidate, t) {
    this.setState(FieldSet.utils.mergeField({
      field: 'firstName',
      value,
      error: (value.trim().length <= 0 && t('pledge/contact/firstName/error/empty')),
      dirty: shouldValidate
    }))
  }
  handleLastName (value, shouldValidate, t) {
    this.setState(FieldSet.utils.mergeField({
      field: 'lastName',
      value,
      error: (value.trim().length <= 0 && t('pledge/contact/lastName/error/empty')),
      dirty: shouldValidate
    }))
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
  handleVoucherCode (value, shouldValidate, t) {
    this.setState(FieldSet.utils.mergeField({
      field: 'voucherCode',
      value,
      error: (
        value.trim().length <= 0 && t('memberships/claim/voucherCode/label/error/empty')
      ),
      dirty: shouldValidate
    }))
  }
  checkUserFields ({me, t}) {
    const defaultValues = {
      firstName: (me && me.firstName) || '',
      lastName: (me && me.lastName) || '',
      email: (me && me.email) || ''
    }
    const values = {
      ...defaultValues,
      ...this.state.values
    }
    this.handleFirstName(values.firstName, false, t)
    this.handleLastName(values.lastName, false, t)
    this.handleEmail(values.email, false, t)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.me !== this.props.me) {
      this.checkUserFields(nextProps)
    }
  }
  componentDidMount () {
    this.checkUserFields(this.props)
    this.handleVoucherCode(
      this.state.values.voucherCode || '',
      false,
      this.props.t
    )
  }
  claim () {
    const {me} = this.props
    const {values} = this.state

    this.setState(() => ({
      loading: true
    }))

    const catchError = error => {
      this.setState(() => ({
        loading: false,
        serverError: error
      }))
    }

    if (me && me.email !== values.email) {
      this.props.signOut().then(() => {
        this.claim()
      }).catch(catchError)
      return
    }

    if (!me) {
      this.props.signIn(values.email)
        .then(({data}) => {
          this.setState(() => ({
            polling: true,
            phrase: data.signIn.phrase
          }))
        })
        .catch(catchError)
      return
    }

    const claim = () => {
      this.props.claim(values.voucherCode)
        .then(() => {
          gotoMerci({})
        })
        .catch(catchError)
    }
    if (
      me.firstName !== values.firstName ||
      me.lastName !== values.lastName
    ) {
      this.props.updateName({
        firstName: values.firstName,
        lastName: values.lastName
      })
        .then(() => {
          claim()
        })
        .catch(catchError)
      return
    }
    claim()
  }
  render () {
    const {t} = this.props

    const {
      serverError,
      values, dirty, errors,
      loading,
      polling, phrase,
      legal
    } = this.state

    if (polling) {
      return (
        <div>
          <P>
            <RawHtmlElements t={t} translationKey='signIn/polling' replacements={{
              phrase: <b key='phrase'>{phrase}</b>,
              email: <b key='email'>{values.email}</b>,
              link: (
                <Link route='signin'>
                  <a {...linkRule}>{t('signIn/polling/link')}</a>
                </Link>
              )
            }} />
          </P>
          <Poller onSuccess={() => {
            this.setState(() => ({
              polling: false
            }))
            this.claim()
          }} />
        </div>
      )
    }
    if (loading) {
      return <Loader loading message={t('memberships/claim/loading')} />
    }

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .concat([
        !legal && t('memberships/claim/legal/error')
      ])
      .filter(Boolean)

    return (
      <div>
        <H2 style={{marginBottom: 20}}>
          {t('memberships/claim/lead')}
        </H2>
        <Field label={t('pledge/contact/firstName/label')}
          name='firstName'
          error={dirty.firstName && errors.firstName}
          value={values.firstName}
          onChange={(_, value, shouldValidate) => {
            this.handleFirstName(value, shouldValidate, t)
          }} />
        <br />
        <Field label={t('pledge/contact/lastName/label')}
          name='lastName'
          error={dirty.lastName && errors.lastName}
          value={values.lastName}
          onChange={(_, value, shouldValidate) => {
            this.handleLastName(value, shouldValidate, t)
          }} />
        <br />
        <Field label={t('pledge/contact/email/label')}
          name='email'
          type='email'
          error={dirty.email && errors.email}
          value={values.email}
          onChange={(_, value, shouldValidate) => {
            this.handleEmail(value, shouldValidate, t)
          }} />
        <br />
        <Field label={t('memberships/claim/voucherCode/label')}
          name='voucherCode'
          error={dirty.voucherCode && errors.voucherCode}
          value={values.voucherCode}
          onChange={(_, value, shouldValidate) => {
            this.handleVoucherCode(value, shouldValidate, t)
          }} />
        <br />
        <br />
        {!!this.state.showErrors && errorMessages.length > 0 && (
          <div style={{color: colors.error, marginBottom: 40}}>
            {t('memberships/claim/error/title')}<br />
            <ul>
              {errorMessages.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <Checkbox
          checked={this.state.legal}
          onChange={(_, checked) => {
            this.setState(() => ({legal: checked}))
          }}>
          <RawHtml dangerouslySetInnerHTML={{
            __html: t('memberships/claim/legal/label')
          }} />
        </Checkbox>
        <br /><br />
        <div style={{opacity: errorMessages.length ? 0.5 : 1}}>
          <Button
            onClick={() => {
              if (errorMessages.length) {
                this.setState((state) => ({
                  showErrors: true,
                  dirty: {
                    ...state.dirty,
                    firstName: true,
                    lastName: true,
                    email: true,
                    voucherCode: true
                  }
                }))
                return
              }
              this.claim()
            }}>
            {t('memberships/claim/button')}
          </Button>
        </div>
        <br />
        {!!serverError && <ErrorMessage error={serverError} />}
      </div>
    )
  }
}

ClaimMembership.propTypes = {
  me: PropTypes.object,
  t: PropTypes.func.isRequired
}

const claimMembership = gql`
mutation claimMembership($voucherCode: String!) {
  claimMembership(voucherCode: $voucherCode)
}`

const updateName = gql`mutation updateName($firstName: String!, $lastName: String!) {
  updateMe(firstName: $firstName, lastName: $lastName) {
    id
  }
}`

export default compose(
  graphql(claimMembership, {
    props: ({mutate}) => ({
      claim: voucherCode => mutate({
        variables: {
          voucherCode
        }
      })
    })
  }),
  graphql(updateName, {
    props: ({mutate}) => ({
      updateName: variables => mutate({
        variables,
        refetchQueries: [{
          query: meQuery
        }]
      })
    })
  }),
  withSignOut,
  withSignIn,
  withMe,
  withT
)(ClaimMembership)
