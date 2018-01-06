import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import Loader from '../Loader'
import withT from '../../lib/withT'

import Box from '../Frame/Box'
import { P } from './Elements'
import { InlineSpinner, Interaction, Checkbox } from '@project-r/styleguide'

const { H2 } = Interaction

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

class NewsletterSubscriptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mutating: {}
    }
  }

  render () {
    const { t, me, loading, error, updateNewsletterSubscription } = this.props
    const newsletters = me.newsletters
    const { mutating } = this.state
    const hasNonEligibleSubscription = newsletters.some(
      newsletter => !newsletter.isEligible
    )

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => (
          <Fragment>
            <H2 {...styles.headline} id='newsletter'>
              {t('account/newsletterSubscriptions/title')}
            </H2>
            {hasNonEligibleSubscription && (
              <Box style={{ padding: 15 }}>
                <P>{t('account/newsletterSubscriptions/noMembership')}</P>
              </Box>
            )}
            {newsletters.map(({ name, subscribed, isEligible }) => (
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
                      subscribed: checked
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
        )}
      />
    )
  }
}

const mutation = gql`
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

const query = gql`
  query myNewsletterSubscriptions {
    me {
      id
      newsletters {
        id
        name
        subscribed
        isEligible
      }
    }
  }
`

export default compose(
  graphql(mutation, {
    props: ({ mutate }) => ({
      updateNewsletterSubscription: ({ name, subscribed }) =>
        mutate({
          variables: {
            name,
            subscribed
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
