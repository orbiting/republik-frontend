import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import isEmail from 'validator/lib/isEmail'
import { withRouter } from 'next/router'

import { Router, Link } from '../../lib/routes'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import {
  CDN_FRONTEND_BASE_URL,
  ASSETS_SERVER_BASE_URL,
  PUBLIC_BASE_URL
} from '../../lib/constants'

import Meta from '../Frame/Meta'
import Loader from '../Loader'
import FieldSet from '../FieldSet'
import SignIn from '../Auth/SignIn'
import { withSignOut } from '../Auth/SignOut'
import withMembership from '../Auth/withMembership'

import {
  Interaction,
  Field,
  A,
  colors,
  RawHtml,
  Label
} from '@project-r/styleguide'

import Accordion from './Accordion'
import Submit from './Submit'
import CustomizePackage, {
  getOptionFieldKey,
  getOptionPeriodsFieldKey
} from './CustomizePackage'

const { H1, H2, P } = Interaction

class Pledge extends Component {
  constructor(props) {
    super(props)

    const values = {}
    let basePledge

    const { pledge, query } = props

    // ~ as url safe separator, backend code generating a membership ids link:
    // https://github.com/orbiting/backends/blob/0abb797db8d0feb7af579c7efc85242cdf110016/servers/republik/modules/crowdfundings/lib/Mail.js#L476
    const membershipIds = query.membershipIds && query.membershipIds.split('~')
    if (membershipIds) {
      const pkg = this.getPkg()
      if (pkg) {
        const matchingOptions = pkg.options.filter(
          option =>
            option.membership && membershipIds.includes(option.membership.id)
        )
        if (matchingOptions.length) {
          // we set all other options to the min amount (normally 0)
          // - this unselect extending ones own memberhip when arriving from a membership_giver_prolong_notice
          pkg.options
            .filter(option => option.membership)
            .forEach(option => {
              values[getOptionFieldKey(option)] = option.minAmount
            })
          // set matching options to max amount (normally 1)
          matchingOptions
            // only first one if grouped
            .filter(
              (option, i, all) =>
                !option.optionGroup ||
                all.findIndex(o => o.optionGroup === option.optionGroup) === i
            )
            .forEach(option => {
              values[getOptionFieldKey(option)] = option.maxAmount
            })
        }
      }
    }

    if (query.membershipType) {
      const pkg = this.getPkg()
      if (pkg) {
        const matchingOptions = pkg.options.filter(
          option =>
            option.membership &&
            option.reward &&
            option.reward.name === query.membershipType
        )
        if (matchingOptions.length) {
          // we set all other options to the min amount (normally 0)
          pkg.options
            .filter(option => option.membership)
            .forEach(option => {
              values[getOptionFieldKey(option)] = option.minAmount
            })
          // set matching options to max amount (normally 1)
          matchingOptions
            // only first one if grouped
            .filter(
              (option, i, all) =>
                !option.optionGroup ||
                all.findIndex(o => o.optionGroup === option.optionGroup) === i
            )
            .forEach(option => {
              values[getOptionFieldKey(option)] = option.maxAmount
            })
        }
      }
    }

    if (pledge) {
      values.email = pledge.user.email
      values.firstName = pledge.user.firstName
      values.lastName = pledge.user.lastName
      values.reason = pledge.reason
      values.messageToClaimers = pledge.messageToClaimers
      values.price = pledge.total
      pledge.options.forEach(option => {
        values[getOptionFieldKey(option)] = option.amount
        if (option.periods !== null) {
          values[getOptionPeriodsFieldKey(option)] = option.periods
        }
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
    } else {
      values.price = +query.price || undefined
      values.reason = query.reason
    }

    this.state = {
      basePledge,
      values,
      errors: {},
      dirty: {
        price: values.price ? true : undefined
      }
    }
  }
  getPkg(base) {
    const { query } = base || this.props
    const { packages } = this.props
    let pkg = query.package
      ? packages.find(pkg => pkg.name === query.package.toUpperCase())
      : null
    if (pkg) {
      if (query.userPrice) {
        // do not offer goodies unless userPrice true
        pkg = {
          ...pkg,
          options: pkg.options.filter(
            option => option.reward.__typename !== 'Goodie' || option.userPrice
          )
        }
      }
      const hasAccessGrantedAndNot =
        pkg.options.some(option => option.accessGranted) &&
        pkg.options.some(option => !option.accessGranted)
      if (hasAccessGrantedAndNot) {
        const showAccessGranted = query.filter === 'pot'
        pkg = {
          ...pkg,
          options: pkg.options
            .filter(option => option.accessGranted === showAccessGranted)
            .map(option => ({
              ...option,
              defaultAmount: showAccessGranted
                ? Math.min(option.maxAmount, 1)
                : option.defaultAmount
            }))
        }
      }
    }

    return pkg
  }
  submitPledgeProps({ values, query, pledge }) {
    const { customMe } = this.props
    const pkg = this.getPkg({ query })
    const userPrice = !!query.userPrice

    let hasAccessGranted
    let requireShippingAddress = false
    const options = pkg
      ? pkg.options.map(option => {
          const fieldKey = getOptionFieldKey(option)
          const fieldKeyPeriods = getOptionPeriodsFieldKey(option)

          const amount =
            values[fieldKey] === undefined
              ? option.defaultAmount
              : // can be '', but PackageOptionInput needs Int! here
                +values[fieldKey]
          if (amount) {
            if (option.accessGranted) {
              hasAccessGranted = true
            }
            if (option.reward?.__typename === 'Goodie') {
              requireShippingAddress = true
            }
          }

          return {
            amount,
            periods:
              values[fieldKeyPeriods] !== undefined
                ? // can be '', but PackageOptionInput needs Int here
                  +values[fieldKeyPeriods]
                : option.reward && option.reward.defaultPeriods,
            price: option.price,
            templateId: option.templateId,
            membershipId: option.membership ? option.membership.id : undefined,
            /* ToDo: move logic to backend? */
            autoPay:
              option.reward &&
              option.reward.__typename === 'MembershipType' &&
              pkg.group !== 'GIVE' &&
              (!option.membership ||
                option.membership.user.id === (customMe && customMe.id))
                ? true /* ToDo: check base pledge value once supported in backend */
                : undefined
          }
        })
      : []

    return {
      accessToken: query.token,
      packageGroup: pkg ? pkg.group : undefined,
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
      options,
      reason: userPrice ? values.reason : undefined,
      messageToClaimers: hasAccessGranted
        ? values.messageToClaimers
        : undefined,
      id: pledge ? pledge.id : undefined,
      pledgeShippingAddress: pledge ? pledge.shippingAddress : undefined,
      requireShippingAddress
    }
  }
  handleFirstName(value, shouldValidate, t) {
    this.setState(
      FieldSet.utils.mergeField({
        field: 'firstName',
        value,
        error:
          value.trim().length <= 0 && t('pledge/contact/firstName/error/empty'),
        dirty: shouldValidate
      })
    )
  }
  handleLastName(value, shouldValidate, t) {
    this.setState(
      FieldSet.utils.mergeField({
        field: 'lastName',
        value,
        error:
          value.trim().length <= 0 && t('pledge/contact/lastName/error/empty'),
        dirty: shouldValidate
      })
    )
  }
  handleEmail(value, shouldValidate, t) {
    this.setState(
      FieldSet.utils.mergeField({
        field: 'email',
        value,
        error:
          (value.trim().length <= 0 && t('pledge/contact/email/error/empty')) ||
          (!isEmail(value) && t('pledge/contact/email/error/invalid')),
        dirty: shouldValidate
      })
    )
  }
  checkUserFields(props) {
    const values = props.customMe ? props.customMe : this.state.values
    this.handleFirstName(values.firstName || '', false, props.t)
    this.handleLastName(values.lastName || '', false, props.t)
    this.handleEmail(values.email || '', false, props.t)
  }
  refetchPackages() {
    const prevPkg = this.getPkg()
    this.props.refetchPackages().then(() => {
      if (this.getPkg() !== prevPkg) {
        window.scrollTo(0, 0)
      }
    })
  }
  prefillValues({ query }) {
    const { values } = this.state
    if (!values.price && query.price) {
      this.setState(
        FieldSet.utils.mergeField({
          field: 'price',
          value: +query.price || undefined
        })
      )
    }
    if (!values.reason && query.reason) {
      this.setState(
        FieldSet.utils.mergeField({
          field: 'reason',
          value: query.reason
        })
      )
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.customMe !== this.props.customMe) {
      this.checkUserFields(nextProps)
    }
    if (nextProps.me !== this.props.me) {
      this.refetchPackages()
    }
    if (nextProps.query !== this.props.query) {
      this.prefillValues(nextProps)
    }
  }
  componentDidMount() {
    this.checkUserFields(this.props)
    this.prefillValues(this.props)
  }
  render() {
    const { values, errors, dirty, basePledge } = this.state

    const {
      loading,
      error,
      isMember,
      t,
      customMe,
      statement,
      query,
      packages
    } = this.props

    const queryGroup = query.group
    const queryPackage = query.package && query.package.toUpperCase()
    const pkg = this.getPkg()

    const statementTitle =
      statement &&
      t(`pledge/form/statement/${queryPackage}/title`, statement, '')
    const packageInstruction = t.elements(
      `pledge/form/instruction/${queryPackage}/${
        customMe
          ? pkg
            ? statementTitle
              ? 'availableWithStatement'
              : 'available'
            : 'notAvailable'
          : 'signIn'
      }`,
      {
        accountLink: (
          <Link key='account' route='account' passHref>
            <A>{t(`pledge/form/instruction/${queryPackage}/accountText`)}</A>
          </Link>
        )
      },
      ''
    )

    const meta = statementTitle
      ? {
          title: t('pledge/form/statement/share/title', statement),
          description: t('pledge/form/statement/share/description'),
          image: `${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${encodeURIComponent(
            statement.updatedAt
          )}&url=${encodeURIComponent(
            `${PUBLIC_BASE_URL}/community?share=${statement.id}&package=${queryPackage}`
          )}`
        }
      : {
          title: t.first([
            pkg && `pledge/meta/package/${pkg.name}/title`,
            queryGroup && `pledge/meta/group/${queryGroup}/title`,
            'pledge/meta/title'
          ]),
          description: t.first([
            pkg && `pledge/meta/package/${pkg.name}/description`,
            queryGroup && `pledge/meta/group/${queryGroup}/description`,
            'pledge/meta/description'
          ]),
          image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
        }

    return (
      <Fragment>
        <Meta data={meta} />
        <Loader
          loading={loading}
          error={error}
          render={() => {
            const { receiveError, crowdfundingName, hasEnded, me } = this.props

            if (hasEnded && !this.props.pledge) {
              return (
                <div>
                  <H1>{t('pledge/title')}</H1>
                  <RawHtml
                    type={P}
                    dangerouslySetInnerHTML={{
                      __html: t('ended/pledge/lead')
                    }}
                  />
                </div>
              )
            }

            const showSignIn = this.state.showSignIn && !me
            const userPrice = !!query.userPrice

            const ownMembershipOption =
              customMe &&
              pkg &&
              pkg.options.find(
                option =>
                  option.membership &&
                  option.membership.user &&
                  option.membership.user.id === customMe.id
              )
            const ownMembership =
              ownMembershipOption && ownMembershipOption.membership
            const title = t.first(
              [
                ownMembership &&
                  `pledge/title/${pkg.name}/${ownMembership.type.name}`,
                ownMembership &&
                  new Date(ownMembership.graceEndDate) < new Date() &&
                  `pledge/title/${pkg.name}/reactivate`,
                pkg && isMember && `pledge/title/${pkg.name}/member`,
                pkg && `pledge/title/${pkg.name}`,
                !pkg && isMember && 'pledge/title/member',
                !pkg && 'pledge/title'
              ].filter(Boolean),
              undefined,
              ''
            )

            return (
              <div>
                {(statementTitle ||
                  (packageInstruction && !!packageInstruction.length)) && (
                  <div style={{ marginBottom: 40 }}>
                    <P>
                      {statementTitle && (
                        <Fragment>
                          <Interaction.Emphasis>
                            {statementTitle}
                          </Interaction.Emphasis>
                          <br />
                        </Fragment>
                      )}
                      {packageInstruction}
                    </P>
                    {!customMe && (
                      <div style={{ marginTop: 20 }}>
                        <SignIn context='pledge' />
                      </div>
                    )}
                  </div>
                )}
                <H1>{title}</H1>

                {!!receiveError && (
                  <P style={{ color: colors.error, marginBottom: 40 }}>
                    {receiveError}
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
                      ownMembership={ownMembership}
                      customMe={customMe}
                      userPrice={userPrice}
                      pkg={pkg}
                      packages={packages}
                      onChange={fields => {
                        this.setState(FieldSet.utils.mergeFields(fields))
                      }}
                    />
                  ) : (
                    <Accordion
                      crowdfundingName={crowdfundingName}
                      packages={packages}
                      group={queryGroup}
                      extended
                    />
                  )}
                </div>
                {pkg && (
                  <Fragment>
                    <H2>
                      {t.first([
                        `pledge/contact/title/${pkg.name}`,
                        'pledge/contact/title'
                      ])}
                    </H2>
                    <div style={{ marginTop: 10, marginBottom: 40 }}>
                      {me ? (
                        <Fragment>
                          {t('pledge/contact/signedinAs', {
                            nameOrEmail: me.name
                              ? `${me.name.trim()} (${me.email})`
                              : me.email
                          })}{' '}
                          <A
                            href='#'
                            onClick={e => {
                              e.preventDefault()
                              this.props.signOut().then(() => {
                                this.handleFirstName('', false, t)
                                this.handleLastName('', false, t)
                                this.handleEmail('', false, t)
                                this.setState(() => ({ showSignIn: false }))
                              })
                            }}
                          >
                            {t('pledge/contact/signOut')}
                          </A>
                          <br />
                          <br />
                          {/* TODO: add active membership info */}
                          <br />
                          <br />
                        </Fragment>
                      ) : (
                        !customMe && (
                          <Fragment>
                            <A
                              href='#'
                              onClick={e => {
                                e.preventDefault()
                                this.setState(() => ({
                                  showSignIn: !showSignIn
                                }))
                              }}
                            >
                              {t(
                                `pledge/contact/signIn/${
                                  showSignIn ? 'hide' : 'show'
                                }`
                              )}
                            </A>
                            {!!showSignIn && (
                              <Fragment>
                                <br />
                                <br />
                                <SignIn context='pledge' />
                              </Fragment>
                            )}
                            <br />
                          </Fragment>
                        )
                      )}
                      {!showSignIn && (
                        <Fragment>
                          <Field
                            label={t('pledge/contact/firstName/label')}
                            name='firstName'
                            error={dirty.firstName && errors.firstName}
                            value={values.firstName}
                            onChange={(_, value, shouldValidate) => {
                              this.handleFirstName(value, shouldValidate, t)
                            }}
                          />
                          <br />
                          <Field
                            label={t('pledge/contact/lastName/label')}
                            name='lastName'
                            error={dirty.lastName && errors.lastName}
                            value={values.lastName}
                            onChange={(_, value, shouldValidate) => {
                              this.handleLastName(value, shouldValidate, t)
                            }}
                          />
                          <br />
                          {customMe && !customMe.isUserOfCurrentSession ? (
                            <Fragment>
                              <Interaction.P>
                                <Label>{t('pledge/contact/email/label')}</Label>
                                <br />
                                {values.email}
                              </Interaction.P>
                              <br />
                              <A
                                href='#'
                                onClick={e => {
                                  e.preventDefault()

                                  const { router } = this.props
                                  const params = { ...router.query }
                                  delete params.token
                                  Router.replaceRoute('pledge', params, {
                                    shallow: true
                                  }).then(() => {
                                    this.refetchPackages()
                                  })
                                }}
                              >
                                {t('pledge/contact/signIn/wrongToken')}
                              </A>
                            </Fragment>
                          ) : (
                            <Field
                              label={t('pledge/contact/email/label')}
                              name='email'
                              type='email'
                              error={dirty.email && errors.email}
                              value={values.email}
                              onChange={(_, value, shouldValidate) => {
                                this.handleEmail(value, shouldValidate, t)
                              }}
                            />
                          )}
                          <br />
                          <br />
                        </Fragment>
                      )}
                    </div>

                    <Submit
                      query={query}
                      customMe={customMe}
                      {...this.submitPledgeProps({ values, query })}
                      basePledge={
                        basePledge
                          ? this.submitPledgeProps(basePledge)
                          : undefined
                      }
                      errors={errors}
                      onError={() => {
                        this.setState(state => {
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
                      }}
                    />
                  </Fragment>
                )}
              </div>
            )
          }}
        />
      </Fragment>
    )
  }
}

Pledge.propTypes = {
  query: PropTypes.object.isRequired
}

const query = gql`
  query pledgeForm($crowdfundingName: String!, $accessToken: ID) {
    crowdfunding(name: $crowdfundingName) {
      id
      name
      hasEnded
      packages {
        id
        name
        group
        paymentMethods
        options {
          id
          price
          userPrice
          minAmount
          maxAmount
          defaultAmount
          templateId
          accessGranted
          reward {
            __typename
            ... on MembershipType {
              id
              name
              interval
              minPeriods
              maxPeriods
              defaultPeriods
            }
            ... on Goodie {
              id
              name
            }
          }
        }
      }
    }
    me(accessToken: $accessToken) {
      id
      firstName
      lastName
      email
      isUserOfCurrentSession
      isListed
      address {
        name
        line1
        line2
        postalCode
        city
        country
      }
      customPackages {
        id
        name
        group
        paymentMethods
        options {
          id
          price
          userPrice
          minAmount
          maxAmount
          defaultAmount
          templateId
          optionGroup
          accessGranted
          reward {
            __typename
            ... on MembershipType {
              id
              name
              interval
              minPeriods
              maxPeriods
              defaultPeriods
            }
            ... on Goodie {
              id
              name
            }
          }
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
            autoPay
            graceEndDate
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

const shareRefQuery = gql`
  query statementsShareRef($id: String!) {
    statements(focus: $id, first: 1) {
      nodes {
        id
        name
        updatedAt
      }
    }
  }
`

const PledgeWithQueries = compose(
  graphql(shareRefQuery, {
    options: ({ query }) => ({
      variables: {
        id: query.utm_content || query.ref
      }
    }),
    skip: props => !(props.query.utm_content || props.query.ref),
    props: ({ data }) => {
      return {
        statement:
          data.statements && data.statements.nodes && data.statements.nodes[0]
      }
    }
  }),
  graphql(query, {
    options: ({ query, crowdfundingName }) => ({
      variables: {
        crowdfundingName,
        accessToken: query.token
      }
    }),
    props: ({ data }) => {
      const packages = []
        .concat(data.me && data.me.customPackages)
        .concat(data.crowdfunding && data.crowdfunding.packages)
        .filter(Boolean)
      return {
        refetchPackages: data.refetch,
        loading: data.loading,
        error: data.error,
        packages,
        hasEnded: data.crowdfunding && data.crowdfunding.hasEnded,
        customMe: data.me
      }
    }
  }),
  withMembership, // provides isMember
  withSignOut,
  withT,
  withMe,
  withRouter
)(Pledge)

export default PledgeWithQueries
