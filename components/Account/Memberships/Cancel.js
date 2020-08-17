import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import AutosizeInput from 'react-textarea-autosize'

import { timeFormat } from '../../../lib/utils/format'
import withT from '../../../lib/withT'
import { errorToString } from '../../../lib/utils/errors'
import ErrorMessage from '../../ErrorMessage'
import { Item, P } from '../Elements'

import { Router, Link } from '../../../lib/routes'

import {
  Loader,
  A,
  Field,
  Radio,
  Button,
  Interaction,
  InlineSpinner
} from '@project-r/styleguide'

import myBelongings from '../belongingsQuery'

const dayFormat = timeFormat('%d. %B %Y')

export const styles = {
  autoSize: css({
    minHeight: 40,
    paddingTop: '7px !important',
    paddingBottom: '6px !important',
    background: 'transparent'
  })
}

const cancellationCategories = gql`
  query cancellationCategories {
    cancellationCategories {
      type
      label
    }
  }
`

const cancelMembership = gql`
  mutation cancelMembership($id: ID!, $details: CancellationInput!) {
    cancelMembership(id: $id, details: $details) {
      id
      active
      renew
    }
  }
`

class CancelMembership extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      isCancelling: false,
      isCancelled: false,
      cancellationType: '',
      reason: '',
      remoteError: null
    }
  }
  redirectIfNecessary() {
    const { redirectMemberships } = this.props
    if (redirectMemberships && redirectMemberships.length) {
      if (redirectMemberships.length > 1) {
        Router.pushRoute('account')
      } else {
        Router.replaceRoute('cancel', {
          membershipId: redirectMemberships[0].id
        })
      }
    }
  }
  componentDidMount() {
    this.redirectIfNecessary()
  }
  componentDidUpdate() {
    this.redirectIfNecessary()
  }
  render() {
    const { loading, error, membership, cancellationCategories, t } = this.props
    const {
      isCancelled,
      isCancelling,
      remoteError,
      cancellationType,
      reason
    } = this.state
    return (
      <Loader
        loading={loading}
        error={
          error || (!membership && !loading && t('memberships/cancel/notFound'))
        }
        render={() => {
          const latestPeriod = membership.periods[0]
          const formattedEndDate =
            latestPeriod && dayFormat(new Date(latestPeriod.endDate))
          if (isCancelled || !membership.renew) {
            return (
              <Fragment>
                <Interaction.H1>
                  {t('memberships/cancel/confirmation/title')}
                </Interaction.H1>
                <Interaction.P style={{ margin: '20px 0' }}>
                  {t('memberships/cancel/confirmation')}
                </Interaction.P>
                <Interaction.P style={{ margin: '20px 0' }}>
                  <Link route='cockpit' passHref>
                    <A>{t('memberships/cancel/confirmation/cockpit')}</A>
                  </Link>
                  <br />
                  <Link route='account' passHref>
                    <A>{t('memberships/cancel/accountLink')}</A>
                  </Link>
                </Interaction.P>
              </Fragment>
            )
          }
          return (
            <Fragment>
              <Interaction.H1>{t('memberships/cancel/title')}</Interaction.H1>
              {remoteError && <ErrorMessage error={remoteError} />}
              <Item
                createdAt={new Date(membership.createdAt)}
                title={t(`memberships/title/${membership.type.name}`, {
                  sequenceNumber: membership.sequenceNumber
                })}
              >
                {!!latestPeriod && (
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
              </Item>
              <Interaction.P style={{ marginBottom: 5 }}>
                {t('memberships/cancel/info')}
              </Interaction.P>
              {cancellationCategories.map(({ type, label }) => (
                <div key={type}>
                  <Radio
                    value={cancellationType}
                    checked={cancellationType === type}
                    onChange={() => this.setState({ cancellationType: type })}
                  >
                    {label}
                  </Radio>
                </div>
              ))}
              {['OTHER', 'EDITORIAL'].includes(cancellationType) && (
                <Field
                  label={t('memberships/cancel/description')}
                  value={reason}
                  renderInput={({ ref, ...inputProps }) => (
                    <AutosizeInput
                      {...styles.autoSize}
                      {...inputProps}
                      inputRef={ref}
                    />
                  )}
                  onChange={(_, reason) => {
                    this.setState({ reason })
                  }}
                />
              )}
              <Button
                style={{ marginTop: '30px' }}
                primary={!isCancelling}
                disabled={isCancelling || !cancellationType}
                onClick={() => {
                  this.setState({
                    isCancelling: true
                  })
                  this.props
                    .cancel({
                      id: membership.id,
                      details: {
                        type: cancellationType,
                        reason
                      }
                    })
                    .then(() => {
                      this.setState({
                        isCancelling: false,
                        isCancelled: true
                      })
                    })
                    .catch(error => {
                      this.setState({
                        isCancelling: false,
                        remoteError: errorToString(error)
                      })
                    })
                }}
              >
                {isCancelling ? (
                  <InlineSpinner size={28} />
                ) : (
                  t('memberships/cancel/button')
                )}
              </Button>
              <br />
              <br />
              <Link route='account' passHref>
                <A>{t('memberships/cancel/accountLink')}</A>
              </Link>
            </Fragment>
          )
        }}
      />
    )
  }
}

export default compose(
  graphql(cancelMembership, {
    props: ({ mutate }) => ({
      cancel: variables => mutate({ variables })
    })
  }),
  graphql(cancellationCategories, {
    props: ({ data, ownProps: { error, loading } }) => ({
      cancellationCategories: data.cancellationCategories,
      loading: loading || data.loading,
      error: error || data.error
    })
  }),
  graphql(myBelongings, {
    props: ({
      data,
      ownProps: { membershipId, error, loading: categoryLoading }
    }) => {
      const memberships = data.me && data.me.memberships
      const membership =
        memberships && memberships.find(v => v.id === membershipId)
      const redirectMemberships =
        !membership &&
        memberships &&
        memberships.filter(v => v.active && v.renew)
      const loading =
        (redirectMemberships && redirectMemberships.length > 0) ||
        categoryLoading ||
        data.loading

      return {
        membership: membership,
        loading,
        redirectMemberships,
        error: error || data.error
      }
    }
  }),
  withT
)(CancelMembership)
