import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../../lib/withT'
import { errorToString } from '../../../lib/utils/errors'
import { timeFormat } from '../../../lib/utils/format'

import { Item as AccountItem, P, A } from '../Elements'
import FieldSet from '../../FieldSet'

import {
  Button, InlineSpinner, colors
} from '@project-r/styleguide'

const dayFormat = timeFormat('%d. %B %Y')

class Manage extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      isCancelling: false,
      values: {},
      dirty: {},
      errors: {}
    }
  }
  renderActions () {
    const { t, membership } = this.props
    const {
      isCancelling,
      values,
      dirty,
      errors,
      updating,
      remoteError
    } = this.state

    if (membership.type.name !== 'MONTHLY_ABO') {
      // currently only MONTHLY_ABO actions are active
      return null
    }

    if (updating) {
      return <InlineSpinner />
    }

    return (
      <Fragment>
        {membership.active && membership.renew && !isCancelling &&
          <A href='#cancel' onClick={(e) => {
            e.preventDefault()
            this.setState({isCancelling: true})
          }}>
            {t.first([
              `memberships/${membership.type.name}/manage/cancel/link`,
              'memberships/manage/cancel/link'
            ])}
          </A>}
        {isCancelling && <Fragment>
          <FieldSet
            values={values}
            errors={errors}
            dirty={dirty}
            fields={[
              {
                label: t('memberships/manage/cancel/reason'),
                name: 'reason',
                autoSize: true
              }
            ]}
            onChange={fields => {
              this.setState(FieldSet.utils.mergeFields(fields))
            }} />
          <Button primary onClick={() => {
            this.setState({
              updating: true
            })
            this.props.cancel({
              id: membership.id,
              reason: values.reason
            })
              .then(() => {
                this.setState({
                  updating: false,
                  remoteError: undefined,
                  isCancelling: false
                })
              })
              .catch(error => {
                this.setState({
                  updating: false,
                  remoteError: errorToString(error)
                })
              })
          }}>
            {t('memberships/manage/cancel/button')}
          </Button>
        </Fragment>}
        {!membership.renew &&
          <A href='#reactivate' onClick={(e) => {
            e.preventDefault()
            this.setState({
              updating: true
            })
            this.props.reactivate({
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
          }}>
            {t.first([
              `memberships/${membership.type.name}/manage/reactivate`,
              'memberships/manage/reactivate'
            ])}
          </A>}
        {!!remoteError &&
          <P style={{color: colors.error, marginTop: 10}}>{remoteError}</P>}
      </Fragment>
    )
  }
  render () {
    const { t, membership, highlighted } = this.props
    const createdAt = new Date(membership.createdAt)
    const latestPeriod = membership.periods[0]
    const formattedEndDate = dayFormat(new Date(latestPeriod.endDate))

    return (
      <AccountItem
        highlighted={highlighted}
        createdAt={createdAt}
        title={[
          t(
            `memberships/type/${membership.type.name}`,
            {},
            membership.type.name
          ),
          `(${t('memberships/sequenceNumber/suffix', membership)})`
        ].join(' ')}>
        <P>
          {membership.active && !membership.overdue && t.first(
            [
              `memberships/${membership.type.name}/latestPeriod/renew/${membership.renew}`,
              `memberships/latestPeriod/renew/${membership.renew}`
            ],
            { formattedEndDate },
            ''
          )}
          {membership.overdue && t(
            'memberships/latestPeriod/overdue',
            { formattedEndDate }
          )}
        </P>
        {this.renderActions()}
      </AccountItem>
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

export default compose(
  withT,
  graphql(cancelMembership, {
    props: ({mutate}) => ({
      cancel: (variables) =>
        mutate({variables})
    })
  }),
  graphql(reactivateMembership, {
    props: ({mutate}) => ({
      reactivate: (variables) =>
        mutate({variables})
    })
  })
)(Manage)
