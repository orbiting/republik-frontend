import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import Loader from '../Loader'
import withT from '../../lib/withT'

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

// TODO: Remove mock response once backend is ready.
const mockResponse = [
  {
    name: 'daily',
    subscribed: false,
    isEligible: true
  },
  {
    name: 'weekly',
    subscribed: true,
    isEligible: true
  },
  {
    name: 'projectr',
    subscribed: true,
    isEligible: true
  }
]

class NewsletterSubscriptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mutating: {}
    }
  }

  render () {
    const { t, me, loading, error, updateNewsletterSubscription } = this.props
    const newsletters = me.newsletters || mockResponse
    const { mutating } = this.state

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => (
          <Fragment>
            <H2 {...styles.headline} id='newsletter'>
              {t('account/newsletterSubscriptions/title')}
            </H2>
            {newsletters.map(({ name, subscribed, isEligible }) => (
              <Fragment>
                {isEligible && (
                  <p key={name}>
                    <Checkbox
                      checked={subscribed}
                      disabled={mutating[name]}
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
                          id: name,
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
                )}
              </Fragment>
            ))}
          </Fragment>
        )}
      />
    )
  }
}

const mutation = gql`
  mutation updateNewsletterSubscription($id: ID!, $subscribed: Boolean!) {
    updateNewsletterSubscription(id: $id, subscribed: $subscribed) {
      id
      subscribed
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
      updateNewsletterSubscription: ({ id, subscribed }) =>
        mutate({
          variables: {
            id,
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
