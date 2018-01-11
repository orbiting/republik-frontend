import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import Loader from '../Loader'
import withT from '../../lib/withT'

import Box from '../Frame/Box'
import { P } from './Elements'
import { InlineSpinner, Checkbox } from '@project-r/styleguide'

const styles = {
  headline: css({
    margin: '80px 0 30px 0'
  }),
  spinnerWrapper: css({
    display: 'inline-block',
    height: 0,
    marginLeft: 15,
    verticalAlign: 'middle',
    '& > span': {
      display: 'inline'
    }
  })
}

const ErrorContainer = ({ children }) => (
  <div style={{ marginTop: 20 }}>{children}</div>
)

class NewsletterSubscriptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mutating: {}
    }
  }

  render () {
    const { t, me, loading, error, updateNewsletterSubscription } = this.props

    return (
      <Loader
        loading={loading}
        error={error}
        ErrorContainer={ErrorContainer}
        render={() => {
          const { subscriptions, status } = me.newsletterSettings
          const { mutating } = this.state
          const hasNonEligibleSubscription = subscriptions.some(
            newsletter => !newsletter.isEligible
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
                <p key={name}>
                  <Checkbox
                    checked={subscribed}
                    disabled={!isEligible || mutating[name]}
                    onChange={(_, checked) => {
                      this.setState(state => ({
                        mutating: {
                          ...state.mutating,
                          [name]: true
                        }
                      }))
                      const finish = () => {
                        this.setState(state => ({
                          mutating: {
                            ...state.mutating,
                            [name]: false
                          }
                        }))
                      }
                      updateNewsletterSubscription({
                        name,
                        subscribed: checked,
                        status
                      }).then(finish)
                    }}
                  >
                    {t(`account/newsletterSubscriptions/${name}/label`)}
                    {mutating[name] && (
                      <span {...styles.spinnerWrapper}>
                        <InlineSpinner size={24} />
                      </span>
                    )}
                  </Checkbox>
                </p>
              ))}
            </Fragment>
          )
        }}
      />
    )
  }
}

const mutation = gql`
  mutation updateNewsletterSubscription(
    $name: NewsletterName!
    $subscribed: Boolean!
    $status: String!
  ) {
    updateNewsletterSubscription(name: $name, subscribed: $subscribed, status: $status) {
      id
      name
      subscribed
      isEligible
    }
  }
`

const query = gql`
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

export default compose(
  graphql(mutation, {
    props: ({ mutate }) => ({
      updateNewsletterSubscription: ({ name, subscribed, status }) =>
        mutate({
          variables: {
            name,
            subscribed,
            status
          }
        })
    })
  }),
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading,
      error: data.error,
      me: data.loading ? undefined : data.me
    })
  }),
  withT
)(NewsletterSubscriptions)
