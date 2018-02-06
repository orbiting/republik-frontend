import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { Link } from '../../lib/routes'

import Loader from '../Loader'

import { Interaction, RawHtml, Lead } from '@project-r/styleguide'

const { H1, P } = Interaction

const getPledgeById = gql`
  query pledge($id: ID!) {
    pledge(id: $id) {
      id
      package {
        name
      }
    }
  }
`

class MerciText extends Component {
  render() {
    const { pledgeId, me, t, loading, error, pledge } = this.props

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => (
          <Fragment>
            <H1>
              {t.first(
                [
                  `merci/title/package/${pledge && pledge.package.name}`,
                  'merci/title'
                ],
                {
                  name: me.name
                }
              )}
            </H1>
            <RawHtml
              type={Lead}
              dangerouslySetInnerHTML={{
                __html: t.first([
                  `merci/lead/package/${pledge && pledge.package.name}`,
                  'merci/lead'
                ])
              }}
            />
          </Fragment>
        )}
      />
    )
  }
}

export default compose(
  graphql(getPledgeById, {
    options: ({ pledgeId }) => ({
      variables: {
        id: pledgeId
      }
    }),
    props: ({ data }) => {
      return {
        loading: data.loading,
        error: data.error,
        pledge: data.pledge
      }
    }
  }),
  withMe,
  withT
)(MerciText)
