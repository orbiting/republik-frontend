import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { compose } from 'redux'
import Loader from '../../components/Loader'
import withT from '../../lib/withT'
import { H1 } from '@project-r/styleguide'

const getMe = gql`
  query getMe {
    me {
      id
      email
    }
  }
`

class Discussion extends Component {
  render () {
    const { data: { loading, error, me }, t } = this.props

    // Demonstrates the use of the Loader with a graphql query.
    // Note that loading 'me' like this is pointless since we already have withMe.
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          return (
            <div>
              <H1>{t('discussion/pageTitle')}</H1>
              <p>{t('me/signedinAs', {nameOrEmail: me.email})}</p>
            </div>
          )
        }}
      />
    )
  }
}

export default compose(
  withT,
  graphql(getMe)
)(Discussion)
