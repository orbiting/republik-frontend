import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import Loader from '../Loader'
import FieldSet from '../FieldSet'
import SignIn from '../Auth/SignIn'
import { withSignOut } from '../Auth/SignOut'
import { validate as isEmail } from 'email-validator'

import {
  Interaction,
  Field,
  A, colors,
  RawHtml
} from '@project-r/styleguide'

import Accordion from './Accordion'
import Submit from './Submit'
import CustomizePackage from './CustomizePackage'
// to be replaced with new membership info
// import {myThingsQuery} from '../Me/queries'

const {H1, H2, P} = Interaction

class Pledge extends Component {
  constructor (props) {
    super(props)

    const values = {}
    let basePledge

    const {pledge, query} = props
    if (pledge) {
      values.email = pledge.user.email
      values.firstName = pledge.user.firstName
      values.lastName = pledge.user.lastName
      values.reason = pledge.reason
      values.price = pledge.total
      pledge.options.forEach(option => {
        values[option.templateId] = option.amount
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
  submitPledgeProps ({values, query, pledge}) {
    const {crowdfunding} = this.props
    const pkg = query.package
      ? crowdfunding.packages.find(
          pkg => pkg.name === query.package.toUpperCase()
        )
      : null
    const userPrice = !!query.userPrice

    return {
      total: values.price || undefined,
      user: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      },
      options: pkg ? pkg.options.map(option => ({
        amount: values[option.id] || option.minAmount,
        price: option.price,
        templateId: option.id
      })) : [],
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
          crowdfunding,
          receiveError,
          pastPledges = [],
          crowdfundingName
        } = this.props

        if (crowdfunding.hasEnded && !this.props.pledge) {
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
          ? crowdfunding.packages.find(
              pkg => pkg.name === query.package.toUpperCase()
            )
          : null
        const userPrice = !!query.userPrice

        return (
          <div>
            <H1>{t('pledge/title')}</H1>

            {!!receiveError && (
              <P style={{color: colors.error, marginBottom: 40}}>
                <RawHtml dangerouslySetInnerHTML={{
                  __html: receiveError
                }} />
              </P>
            )}

            <div style={{marginBottom: 40}}>
              {pkg ? (
                <CustomizePackage
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
                <Accordion crowdfundingName={crowdfundingName} extended />
              )}
            </div>

            <H2>{t('pledge/contact/title')}</H2>
            <div style={{marginTop: 10, marginBottom: 40}}>
              {me ? (
                <span>
                  {t('pledge/contact/signedinAs', {
                    nameOrEmail: me.name || me.email
                  })}
                  {' '}<A href='#' onClick={(e) => {
                    e.preventDefault()
                    this.props.signOut().then(() => {
                      this.handleFirstName('', false, t)
                      this.handleLastName('', false, t)
                      this.handleEmail('', false, t)
                      this.setState(() => ({showSignIn: false}))
                    })
                  }}>{t('pledge/contact/signOut')}</A>
                  <br /><br />
                  {' '}{pastPledges.length > 0 && (
                    <A href='/merci' target='_blank'>
                      {t.pluralize('pledge/contact/pastPledges', {
                        count: pastPledges.length
                      })}
                    </A>
                  )}
                  <br /><br />
                </span>
              ) : (
                <span>
                  <A href='#' onClick={(e) => {
                    e.preventDefault()
                    this.setState(() => ({showSignIn: !showSignIn}))
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
              {...this.submitPledgeProps({values, query})}
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
      options {
        id
        price
        userPrice
        minAmount
        maxAmount
        defaultAmount
        reward {
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
}
`

const PledgeWithQueries = compose(
  graphql(query, {
    props: ({ data }) => {
      return {
        loading: data.loading,
        error: data.error,
        crowdfunding: data.crowdfunding
      }
    }
  }),
  // graphql(myThingsQuery, {
  //   props: ({ data }) => {
  //     return {
  //       pastPledges: (
  //         (
  //           !data.loading &&
  //           !data.error &&
  //           data.me &&
  //           data.me.pledges &&
  //           data.me.pledges.filter(pledge => pledge.status !== 'DRAFT')
  //         ) || []
  //       )
  //     }
  //   }
  // }),
  withSignOut,
  withT,
  withMe
)(Pledge)

export default PledgeWithQueries
