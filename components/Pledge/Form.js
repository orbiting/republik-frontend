import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import Loader from '../Loader'
import FieldSet from '../FieldSet'
import SignIn from '../Auth/SignIn'
import { withSignOut } from '../Auth/SignOut'
import isEmail from 'validator/lib/isEmail'

import {
  Interaction,
  Field,
  A, colors,
  RawHtml
} from '@project-r/styleguide'

import Accordion from './Accordion'
import Submit from './Submit'
import CustomizePackage, { getOptionFieldKey } from './CustomizePackage'

const { H1, H2, P } = Interaction

class Pledge extends Component {
  constructor (props) {
    super(props)

    const values = {}
    let basePledge

    const { pledge, query } = props
    if (pledge) {
      values.email = pledge.user.email
      values.firstName = pledge.user.firstName
      values.lastName = pledge.user.lastName
      values.reason = pledge.reason
      values.price = pledge.total
      pledge.options.forEach(option => {
        values[getOptionFieldKey(option)] = option.amount
      })
      basePledge = {
        values: {
          ...values
        },
        query: {
          ...query
        },
        pledge
      }
    }

    this.state = {
      basePledge,
      values,
      errors: {},
      dirty: {}
    }
  }
  submitPledgeProps ({ values, query, pledge }) {
    const { packages, me } = this.props
    const pkg = query.package
      ? packages.find(
        pkg => pkg.name === query.package.toUpperCase()
      )
      : null
    const userPrice = !!query.userPrice

    return {
      packageName: pkg ? pkg.name : undefined,
      forceAutoPay: pkg ? pkg.name === 'MONTHLY_ABO' : undefined,
      requiresStatutes: pkg
        ? pkg.name !== 'MONTHLY_ABO' && pkg.name !== 'DONATE'
        : undefined,
      paymentMethods: pkg ? pkg.paymentMethods : undefined,
      total: values.price || undefined,
      user: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      },
      options: pkg ? pkg.options.map(option => {
        return {
          amount: values[getOptionFieldKey(option)] || option.minAmount,
          price: option.price,
          templateId: option.templateId,
          membershipId: option.membership
            ? option.membership.id
            : undefined,
          /* ToDo: move logic to backend? */
          autoPay: option.reward && option.reward.__typename === 'MembershipType' && pkg.name !== 'ABO_GIVE' && (
            !option.membership ||
            /* ToDo: handle login-less */
            option.membership.user.id === (me && me.id)
          )
            ? true /* ToDo: check base pledge value once supported in backend */
            : undefined
        }
      }) : [],
      reason: userPrice ? values.reason : undefined,
      id: pledge ? pledge.id : undefined
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
  checkUserFields (props) {
    const values = props.me ? props.me : this.state.values
    this.handleFirstName(values.firstName || '', false, props.t)
    this.handleLastName(values.lastName || '', false, props.t)
    this.handleEmail(values.email || '', false, props.t)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.me !== this.props.me) {
      this.checkUserFields(nextProps)
    }
  }
  componentDidMount () {
    this.checkUserFields(this.props)
  }
  render () {
    const {
      values,
      errors,
      dirty,
      basePledge
    } = this.state

    const {
      loading, error
    } = this.props

    return (
      <Loader loading={loading} error={error} render={() => {
        const {
          query, me, t,
          receiveError,
          crowdfundingName,
          hasEnded,
          packages
        } = this.props

        if (hasEnded && !this.props.pledge) {
          return (
            <div>
              <H1>{t('pledge/title')}</H1>
              <RawHtml type={P} dangerouslySetInnerHTML={{
                __html: t('ended/pledge/lead')
              }} />
            </div>
          )
        }

        const showSignIn = this.state.showSignIn && !me

        const pkg = query.package
          ? packages.find(
            pkg => pkg.name === query.package.toUpperCase()
          )
          : null
        const userPrice = !!query.userPrice

        return (
          <div>
            <H1>{t('pledge/title')}</H1>

            {!!receiveError && (
              <P style={{ color: colors.error, marginBottom: 40 }}>
                <RawHtml dangerouslySetInnerHTML={{
                  __html: receiveError
                }} />
              </P>
            )}

            <div style={{ marginBottom: 40 }}>
              {pkg ? (
                <CustomizePackage
                  key={pkg.id}
                  crowdfundingName={crowdfundingName}
                  values={values}
                  errors={errors}
                  dirty={dirty}
                  userPrice={userPrice}
                  pkg={pkg}
                  onChange={(fields) => {
                    this.setState(FieldSet.utils.mergeFields(fields))
                  }} />
              ) : (
                <Accordion crowdfundingName={crowdfundingName}
                  packages={packages} extended />
              )}
            </div>
            {pkg && (
              <Fragment>
                <H2>{t('pledge/contact/title')}</H2>
                <div style={{ marginTop: 10, marginBottom: 40 }}>
                  {me ? (
                    <span>
                      {t('pledge/contact/signedinAs', {
                        nameOrEmail: me.name ? `${me.name.trim()} (${me.email})` : me.email
                      })}
                      {' '}<A href='#' onClick={(e) => {
                        e.preventDefault()
                        this.props.signOut().then(() => {
                          this.handleFirstName('', false, t)
                          this.handleLastName('', false, t)
                          this.handleEmail('', false, t)
                          this.setState(() => ({ showSignIn: false }))
                        })
                      }}>{t('pledge/contact/signOut')}</A>
                      <br /><br />
                      {/* TODO: add active membership info */}
                      <br /><br />
                    </span>
                  ) : (
                    <span>
                      <A href='#' onClick={(e) => {
                        e.preventDefault()
                        this.setState(() => ({ showSignIn: !showSignIn }))
                      }}>{t(`pledge/contact/signIn/${showSignIn ? 'hide' : 'show'}`)}</A>
                      {!!showSignIn && (
                        <span>
                          <br /><br />
                          <SignIn />
                        </span>
                      )}
                      <br />
                    </span>
                  )}
                  {!showSignIn && <span>
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
                    <br /><br />
                  </span>}
                </div>

                <Submit
                  query={query}
                  me={me}
                  {...this.submitPledgeProps({ values, query })}
                  basePledge={basePledge
                    ? this.submitPledgeProps(basePledge)
                    : undefined}
                  errors={errors}
                  onError={() => {
                    this.setState((state) => {
                      const dirty = {
                        ...state.dirty
                      }
                      Object.keys(state.errors).forEach(field => {
                        if (state.errors[field]) {
                          dirty[field] = true
                        }
                      })
                      return {
                        dirty
                      }
                    })
                  }} />
              </Fragment>
            )}
          </div>
        )
      }} />
    )
  }
}

Pledge.propTypes = {
  query: PropTypes.object.isRequired
}

const query = gql`
query pledgeForm($crowdfundingName: String!) {
  crowdfunding(name: $crowdfundingName) {
    id
    name
    hasEnded
    packages {
      id
      name
      paymentMethods
      options {
        id
        price
        userPrice
        minAmount
        maxAmount
        defaultAmount
        templateId
        reward {
          __typename
          ... on MembershipType {
            id
            name
          }
          ... on Goodie {
            id
            name
          }
        }
      }
    }
  }
  me {
    id
    customPackages {
      id
      name
      paymentMethods
      options {
        id
        price
        userPrice
        minAmount
        maxAmount
        defaultAmount
        templateId
        reward {
          __typename
          ... on MembershipType {
            id
            name
          }
          ... on Goodie {
            id
            name
          }
        }
        optionGroup
        membership {
          id
          user {
            id
            name
          }
          createdAt
          sequenceNumber
          renew
          active
          overdue
          type {
            name
          }
          periods {
            kind
            beginDate
            endDate
          }
        }
        additionalPeriods {
          kind
          beginDate
          endDate
        }
      }
    }
  }
}
`

const PledgeWithQueries = compose(
  graphql(query, {
    props: ({ data }) => {
      const packages = []
        .concat(data.crowdfunding && data.crowdfunding.packages)
        .concat(data.me && data.me.customPackages)
        .filter(Boolean)
      return {
        loading: data.loading,
        error: data.error,
        packages,
        hasEnded: data.crowdfunding && data.crowdfunding.hasEnded
      }
    }
  }),
  withSignOut,
  withT,
  withMe
)(Pledge)

export default PledgeWithQueries
