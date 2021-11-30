import React, { Fragment } from 'react'
import compose from 'lodash/flowRight'
import { Query, Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'
import { css } from 'glamor'
import withT from '../../lib/withT'
import ErrorMessage from '../ErrorMessage'

import FrameBox from '../Frame/Box'
import { P } from './Elements'
import {
  Loader,
  InlineSpinner,
  Checkbox,
  Label,
  Button
} from '@project-r/styleguide'
import { withMembership } from '../Auth/checkRoles'
import { newsletterFragment, newsletterSettingsFragment } from './enhancers'

const styles = {
  spinnerWrapper: css({
    display: 'inline-block',
    height: 0,
    marginLeft: 15,
    verticalAlign: 'middle',
    '& > span': {
      display: 'inline'
    }
  }),
  label: css({
    display: 'block',
    paddingLeft: '28px'
  })
}

export const RESUBSCRIBE_EMAIL = gql`
  mutation resubscribeEmail($userId: ID!) {
    resubscribeEmail(userId: $userId) {
      ...NewsletterSettings
    }
  }
  ${newsletterSettingsFragment}
`

export const UPDATE_NEWSLETTER_SUBSCRIPTION = gql`
  mutation updateNewsletterSubscription(
    $name: NewsletterName!
    $subscribed: Boolean!
  ) {
    updateNewsletterSubscription(name: $name, subscribed: $subscribed) {
      ...NewsletterInfo
    }
  }
  ${newsletterFragment}
`

export const NEWSLETTER_SETTINGS = gql`
  query myNewsletterSettings {
    me {
      id
      newsletterSettings {
        ...NewsletterSettings
      }
    }
  }
  ${newsletterSettingsFragment}
`

const NewsletterSubscriptions = props => (
  <Query query={NEWSLETTER_SETTINGS}>
    {({ loading, error, data }) => {
      const { t, isMember } = props

      if (loading || error) {
        return <Loader loading={loading} error={error} />
      }

      if (!data.me || !data.me.newsletterSettings) {
        return (
          <FrameBox style={{ margin: '10px 0', padding: 15 }}>
            <P>{t('account/newsletterSubscriptions/unauthorized')}</P>
          </FrameBox>
        )
      }

      const { status } = data.me.newsletterSettings
      const subscriptions = data.me.newsletterSettings.subscriptions.filter(
        props.onlyName
          ? subscription => subscription.name === props.onlyName
          : Boolean
      )

      return (
        <Fragment>
          {status !== 'subscribed' && (
            <FrameBox style={{ margin: '10px 0', padding: 15 }}>
              <Mutation mutation={RESUBSCRIBE_EMAIL}>
                {(mutate, { loading, error, data: mutationData }) => (
                  <>
                    {status !== 'pending' && (
                      <P>{t('account/newsletterSubscriptions/unsubscribed')}</P>
                    )}
                    {/* Show if the status has been set to pending */}
                    {mutationData?.resubscribeEmail?.status === 'pending' && (
                      <P>{t('account/newsletterSubscriptions/resubscribed')}</P>
                    )}
                    {/* Show if the status is pending an no new email has been requested */}
                    {status === 'pending' && !mutationData && (
                      <P>
                        {t(
                          'account/newsletterSubscriptions/resubscribeEmailPending'
                        )}
                      </P>
                    )}
                    {!mutationData && (
                      <div style={{ marginTop: 10 }}>
                        {error && <ErrorMessage error={error} />}
                        {loading && <InlineSpinner size={40} />}
                        {!loading && (
                          <Button
                            primary
                            onClick={() =>
                              mutate({
                                variables: {
                                  userId: data.me.id
                                }
                              })
                            }
                          >
                            {status !== 'pending'
                              ? t('account/newsletterSubscriptions/resubscribe')
                              : t(
                                  'account/newsletterSubscriptions/resendResubscribeEmail'
                                )}
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </Mutation>
            </FrameBox>
          )}
          {!isMember && !props.free && (
            <FrameBox style={{ margin: '10px 0', padding: 15 }}>
              <P>{t('account/newsletterSubscriptions/noMembership')}</P>
            </FrameBox>
          )}
          {subscriptions.map(({ name, subscribed }) => (
            <Mutation key={name} mutation={UPDATE_NEWSLETTER_SUBSCRIPTION}>
              {(mutate, { loading: mutating, error }) => {
                return (
                  <p>
                    <Checkbox
                      black={props.black}
                      checked={subscribed}
                      disabled={mutating || status === 'unsubscribed'}
                      onChange={(_, checked) => {
                        mutate({
                          variables: {
                            name,
                            subscribed: checked
                          }
                        })
                      }}
                    >
                      <span {...styles.label}>
                        {props.onlyName
                          ? t(
                              `account/newsletterSubscriptions/onlyName/${
                                subscribed ? 'subscribed' : 'subscribe'
                              }`
                            )
                          : t(`account/newsletterSubscriptions/${name}/label`)}
                        {mutating && (
                          <span {...styles.spinnerWrapper}>
                            <InlineSpinner size={24} />
                          </span>
                        )}
                        {!props.onlyName && (
                          <>
                            <br />
                            <Label style={{ color: 'inherit' }}>
                              {t(
                                `account/newsletterSubscriptions/${name}/frequency`
                              )}
                            </Label>
                          </>
                        )}
                        {error && <ErrorMessage error={error} />}
                      </span>
                    </Checkbox>
                  </p>
                )
              }}
            </Mutation>
          ))}
        </Fragment>
      )
    }}
  </Query>
)

export default compose(withT, withMembership)(NewsletterSubscriptions)
