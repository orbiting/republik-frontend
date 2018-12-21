import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Loader from '../../Loader'
import ErrorMessage from '../../ErrorMessage'
import { gotoMerci } from '../../Pledge/Merci'
import Consents, { getConsentsError } from '../../Pledge/Consents'

import withT from '../../../lib/withT'
import withMe, { meQuery } from '../../../lib/apollo/withMe'
import isEmail from 'validator/lib/isEmail'

import Poller from '../../Auth/Poller'
import FieldSet from '../../FieldSet'

import { withSignOut } from '../../Auth/SignOut'
import { withSignIn } from '../../Auth/SignIn'

import {
  Field, Button, Interaction, RawHtml,
  colors
} from '@project-r/styleguide'

const { H2, P } = Interaction

export const isMembershipVoucherCode = (voucherCode) => {
  return voucherCode.length === 6
}

export const isAccessGrantVoucherCode = (voucherCode) => {
  return voucherCode.length === 5
}

export const sanitizeVoucherCode = (value) => {
  return value
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim()
    .substr(0, 6)
    .toUpperCase()
}

class ClaimMembership extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      serverError: undefined,
      consents: [],
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
    const sanitizedValue = sanitizeVoucherCode(value)

    this.setState(FieldSet.utils.mergeField({
      field: 'voucherCode',
      value,
      error:
        (
          sanitizedValue.length === 0 &&
          t('memberships/claim/voucherCode/label/error/empty')
        ) ||
        (
          !isMembershipVoucherCode(sanitizedValue) &&
          !isAccessGrantVoucherCode(sanitizedValue) &&
          t('memberships/claim/voucherCode/label/error/unrecognized')
        ),
      dirty: shouldValidate
    }))
  }
  checkUserFields ({ me, t }) {
    const defaultValues = {
      firstName: (me && me.firstName) || '',
      lastName: (me && me.lastName) || '',
      email: (me && me.email) || (this.props.email) || '',
      voucherCode: (this.props.voucherCode) || ''
    }
    const values = {
      ...defaultValues,
      ...this.state.values
    }
    this.handleFirstName(values.firstName, false, t)
    this.handleLastName(values.lastName, false, t)
    this.handleEmail(values.email, false, t)
    this.handleVoucherCode(values.voucherCode, false, t)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.me !== this.props.me) {
      this.checkUserFields(nextProps)
    }
  }
  componentDidMount () {
    this.checkUserFields(this.props)
  }
  claim (newTokenType) {
    const { me, context } = this.props
    const { values } = this.state

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
      this.props.signIn(
        values.email,
        context || 'claim',
        this.state.consents,
        newTokenType
      )
        .then(({ data }) => {
          this.setState(() => ({
            polling: true,
            signInResponse: data.signIn
          }))
        })
        .catch(catchError)
      return
    }

    const claim = () => {
      const code = sanitizeVoucherCode(values.voucherCode)

      if (isAccessGrantVoucherCode(code)) {
        this.props.claimAccess(code)
          .then(() => {
            gotoMerci({})
          })
          .catch(catchError)
      } else {
        this.props.claimMembership(code)
          .then(() => {
            gotoMerci({})
          })
          .catch(catchError)
      }
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
    const { context, t } = this.props

    const {
      serverError,
      values, dirty, errors,
      loading,
      polling, signInResponse,
      consents
    } = this.state

    const requiredConsents = ['PRIVACY', 'TOS']

    if (
      values.voucherCode &&
      isMembershipVoucherCode(values.voucherCode)
    ) {
      requiredConsents.push('STATUTE')
    }

    const contextLead = t.first([
      `memberships/claim/${context}/lead`,
      'memberships/claim/lead'
    ], {}, false)

    const contextBody = t.first([
      `memberships/claim/${context}/body`,
      'memberships/claim/body'
    ], {}, false)

    if (polling) {
      return (
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
            this.setState(() => ({
              polling: false
            }))
            this.claim(altTokenType)
          }}
          onSuccess={(me) => {
            this.setState(() => ({
              polling: false
            }))
            this.claim()
          }} />
      )
    }
    if (loading) {
      return <Loader loading message={t('memberships/claim/loading')} />
    }

    const errorMessages = Object.keys(errors)
      .map(key => errors[key])
      .concat([
        getConsentsError(t, requiredConsents, consents)
      ])
      .filter(Boolean)

    return (
      <div>
        {contextLead &&
          <H2 style={{ marginBottom: 20 }}>
            {contextLead}
          </H2>
        }
        {contextBody &&
          <RawHtml type={P} dangerouslySetInnerHTML={{
            __html: contextBody
          }} />
        }
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
          <div style={{ color: colors.error, marginBottom: 40 }}>
            {t('memberships/claim/error/title')}<br />
            <ul>
              {errorMessages.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <Consents
          required={requiredConsents}
          accepted={consents}
          onChange={keys => {
            this.setState(() => ({
              consents: keys
            }))
          }} />
        <br /><br />
        <div style={{ opacity: errorMessages.length ? 0.5 : 1 }}>
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

const claimAccess = gql`
mutation claimAccess($voucherCode: String!) {
  claimAccess(voucherCode: $voucherCode) {
    endAt
  }
}`

const updateName = gql`mutation updateName($firstName: String!, $lastName: String!) {
  updateMe(firstName: $firstName, lastName: $lastName) {
    id
  }
}`

export default compose(
  graphql(claimMembership, {
    props: ({ mutate }) => ({
      claimMembership: voucherCode => mutate({
        variables: {
          voucherCode
        }
      })
    })
  }),
  graphql(claimAccess, {
    props: ({ mutate }) => ({
      claimAccess: voucherCode => mutate({
        variables: {
          voucherCode
        }
      })
    })
  }),
  graphql(updateName, {
    props: ({ mutate }) => ({
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
