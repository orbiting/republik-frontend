import React, { Fragment } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import withT from '../../lib/withT'
import ErrorMessage from '../ErrorMessage'

import FrameBox from '../Frame/Box'
import { P } from './Elements'
import { Loader, InlineSpinner, Checkbox, Label } from '@project-r/styleguide'

const NoBox = ({ children, style: { margin } = {} }) => (
  <div style={{ margin }}>{children}</div>
)

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

export const UPDATE_NEWSLETTER_SUBSCRIPTION = gql`
  mutation updateNewsletterSubscription(
    $name: NewsletterName!
    $subscribed: Boolean!
  ) {
    updateNewsletterSubscription(name: $name, subscribed: $subscribed) {
      id
      name
      subscribed
      isEligible
    }
  }
`

export const NEWSLETTER_SETTINGS = gql`
  query myNewsletterSettings {
    me {
      id
      newsletterSettings {
        status
        subscriptions {
          id
          name
          subscribed
          isEligible
        }
      }
    }
  }
`

const NewsletterSubscriptions = props => (
  <Query query={NEWSLETTER_SETTINGS}>
    {({ loading, error, data }) => {
      const { t } = props

      if (loading || error) {
        return <Loader loading={loading} error={error} />
      }

      const Box = props.skipBox ? NoBox : FrameBox

      if (!data.me || !data.me.newsletterSettings) {
        return (
          <Box style={{ margin: '10px 0', padding: 15 }}>
            <P>{t('account/newsletterSubscriptions/unauthorized')}</P>
          </Box>
        )
      }

      const { status } = data.me.newsletterSettings
      const subscriptions = data.me.newsletterSettings.subscriptions.filter(
        props.filter || Boolean
      )

      const hasNonEligibleSubscription = subscriptions.some(
        ({ isEligible }) => !isEligible
      )

      return (
        <Fragment>
          {status !== 'subscribed' && (
            <Box style={{ margin: '10px 0', padding: 15 }}>
              <P>{t('account/newsletterSubscriptions/unsubscribed')}</P>
            </Box>
          )}
          {hasNonEligibleSubscription && (
            <Box style={{ margin: '10px 0', padding: 15 }}>
              <P>{t('account/newsletterSubscriptions/noMembership')}</P>
            </Box>
          )}
          {subscriptions.map(({ name, subscribed, isEligible }) => (
            <Mutation key={name} mutation={UPDATE_NEWSLETTER_SUBSCRIPTION}>
              {(mutate, { loading: mutating, error }) => {
                return (
                  <p>
                    <Checkbox
                      black={props.black}
                      checked={subscribed}
                      disabled={!isEligible || mutating}
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
                        {props.label ||
                          t(`account/newsletterSubscriptions/${name}/label`)}
                        {mutating && (
                          <span {...styles.spinnerWrapper}>
                            <InlineSpinner size={24} />
                          </span>
                        )}
                        {!props.label && (
                          <>
                            <br />
                            <Label>
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

export default withT(NewsletterSubscriptions)
