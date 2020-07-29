import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../../lib/withT'
import { errorToString } from '../../../lib/utils/errors'
import { timeFormat } from '../../../lib/utils/format'
import { Link } from '../../../lib/routes'
import { Item as AccountItem, P } from '../Elements'

import TokenPackageLink from '../../Link/TokenPackage'

import {
  InlineSpinner,
  colors,
  linkRule,
  Interaction,
  A
} from '@project-r/styleguide'

const dayFormat = timeFormat('%d. %B %Y')

class Actions extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      isCancelling: false,
      values: {},
      dirty: {},
      errors: {}
    }
  }
  render() {
    const { t, membership, waitingMemberships } = this.props
    const { updating, remoteError } = this.state

    if (updating) {
      return <InlineSpinner />
    }

    return (
      <Fragment>
        {membership.active &&
          membership.renew &&
          membership.type.name === 'MONTHLY_ABO' && (
            <P>
              <Interaction.Cursive>
                {t.elements('memberships/MONTHLY_ABO/manage/upgrade/link', {
                  buyLink: (
                    <Link route='pledge' params={{ package: 'ABO' }}>
                      <a {...linkRule}>
                        {t(
                          'memberships/MONTHLY_ABO/manage/upgrade/link/buyText'
                        )}
                      </a>
                    </Link>
                  )
                })}
              </Interaction.Cursive>
            </P>
          )}
        {!membership.canProlong && membership.active && waitingMemberships && (
          <P>{t('memberships/manage/prolong/awaiting')}</P>
        )}
        {!waitingMemberships &&
          membership.active &&
          !membership.renew &&
          !!membership.periods.length && (
            <P>
              <A
                href='#reactivate'
                onClick={e => {
                  e.preventDefault()
                  this.setState({
                    updating: true
                  })
                  this.props
                    .reactivate({
                      id: membership.id
                    })
                    .then(() => {
                      this.setState({
                        updating: false,
                        remoteError: undefined
                      })
                    })
                    .catch(error => {
                      this.setState({
                        updating: false,
                        remoteError: errorToString(error)
                      })
                    })
                }}
              >
                {t.first([
                  `memberships/${membership.type.name}/manage/reactivate`,
                  'memberships/manage/reactivate'
                ])}
              </A>
            </P>
          )}
        {membership.active && membership.autoPayIsMutable && (
          <P>
            <A
              href='#autoPay'
              onClick={e => {
                e.preventDefault()
                this.setState({
                  updating: true
                })
                this.props
                  .setAutoPay({
                    id: membership.id,
                    autoPay: !membership.autoPay
                  })
                  .then(() => {
                    this.setState({
                      updating: false,
                      remoteError: undefined
                    })
                  })
                  .catch(error => {
                    this.setState({
                      updating: false,
                      remoteError: errorToString(error)
                    })
                  })
              }}
            >
              {t.first([
                `memberships/${membership.type.name}/manage/autoPay/${
                  membership.autoPay ? 'disable' : 'enable'
                }`,
                `memberships/manage/autoPay/${
                  membership.autoPay ? 'disable' : 'enable'
                }`
              ])}
            </A>
          </P>
        )}
        {!waitingMemberships && membership.canProlong && (
          <P>
            <TokenPackageLink
              params={{
                package: 'PROLONG'
              }}
              passHref
            >
              <A>
                {t.first([
                  `memberships/${membership.type.name}/manage/prolong/link`,
                  'memberships/manage/prolong/link'
                ])}
              </A>
            </TokenPackageLink>
          </P>
        )}
        {!waitingMemberships && membership.active && membership.renew && (
          <P>
            <Link
              route='cancel'
              params={{ membershipId: membership.id }}
              passHref
            >
              <A>
                {t.first([
                  `memberships/${membership.type.name}/manage/cancel/link`,
                  'memberships/manage/cancel/link'
                ])}
              </A>
            </Link>
          </P>
        )}
        {!!remoteError && (
          <P style={{ color: colors.error, marginTop: 10 }}>{remoteError}</P>
        )}
      </Fragment>
    )
  }
}

const cancelMembership = gql`
  mutation cancelMembership($id: ID!, $reason: String) {
    cancelMembership(id: $id, reason: $reason) {
      id
      active
      renew
    }
  }
`

const reactivateMembership = gql`
  mutation reactivateMembership($id: ID!) {
    reactivateMembership(id: $id) {
      id
      active
      renew
    }
  }
`

const setMembershipAutoPay = gql`
  mutation setMembershipAutoPay($id: ID!, $autoPay: Boolean!) {
    setMembershipAutoPay(id: $id, autoPay: $autoPay) {
      id
      autoPay
    }
  }
`

const ManageActions = compose(
  withT,
  graphql(cancelMembership, {
    props: ({ mutate }) => ({
      cancel: variables => mutate({ variables })
    })
  }),
  graphql(reactivateMembership, {
    props: ({ mutate }) => ({
      reactivate: variables => mutate({ variables })
    })
  }),
  graphql(setMembershipAutoPay, {
    props: ({ mutate }) => ({
      setAutoPay: variables => mutate({ variables })
    })
  })
)(Actions)

const Manage = ({
  t,
  membership,
  highlighted,
  waitingMemberships,
  title,
  compact,
  actions
}) => {
  const createdAt = new Date(membership.createdAt)
  const latestPeriod =
    membership.periods &&
    membership.periods.length > 0 &&
    membership.periods.reduce((acc, period) => {
      return acc && new Date(period.endDate) < new Date(acc.endDate)
        ? acc
        : period
    })

  const latestPeriodEndDate = latestPeriod && new Date(latestPeriod.endDate)
  const formattedEndDate = latestPeriod && dayFormat(latestPeriodEndDate)
  const overdue = latestPeriod && latestPeriodEndDate < new Date()

  return (
    <AccountItem
      compact={compact}
      highlighted={highlighted}
      createdAt={createdAt}
      title={
        title ||
        t(`memberships/title/${membership.type.name}`, {
          sequenceNumber: membership.sequenceNumber
        })
      }
    >
      {membership.active && !!latestPeriod && !overdue && (
        <P>
          {membership.active &&
            !membership.overdue &&
            t.first(
              [
                `memberships/${membership.type.name}/latestPeriod/renew/${membership.renew}/autoPay/${membership.autoPay}`,
                `memberships/latestPeriod/renew/${membership.renew}/autoPay/${membership.autoPay}`
              ],
              { formattedEndDate },
              ''
            )}
        </P>
      )}
      {membership.active && !!latestPeriod && overdue && (
        <P>
          {t.first(
            [
              `memberships/${membership.type.name}/latestPeriod/overdue`,
              'memberships/latestPeriod/overdue'
            ],
            { formattedEndDate }
          )}
        </P>
      )}
      {!membership.active && !membership.renew && !!latestPeriod && overdue && (
        <P>
          {t.first(
            [
              `memberships/${membership.type.name}/ended`,
              'memberships/latestPeriod/ended'
            ],
            { formattedEndDate }
          )}
        </P>
      )}
      {actions && (
        <ManageActions
          membership={membership}
          waitingMemberships={waitingMemberships}
        />
      )}
    </AccountItem>
  )
}

Manage.propTypes = {
  title: PropTypes.string,
  membership: PropTypes.object.isRequired,
  actions: PropTypes.bool.isRequired
}

Manage.defaultProps = {
  actions: true
}

export default compose(withT)(Manage)
