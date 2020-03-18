import React from 'react'
import { compose, graphql } from 'react-apollo'
import { mySubscriptions } from './enhancers'
import { mediaQueries } from '@project-r/styleguide'
import Loader from '../Loader'
import { css } from 'glamor'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'

const styles = {
  checkboxes: css({
    margin: '20px 0'
  }),
  checkbox: css({
    display: 'inline-block',
    width: '100%',
    [mediaQueries.mUp]: {
      width: '50%'
    }
  })
}

const FormatCheckboxes = ({ subscriptions }) => (
  <div {...styles.checkboxes}>
    {subscriptions
      .filter(subscription => subscription.object.__typename === 'Document')
      .map((subscription, i) => (
        <SubscribeDocumentCheckbox
          subscription={subscription}
          format={subscription.object}
          key={i}
        />
      ))}
  </div>
)

const SubscribeDocuments = ({ data: { error, loading, me } }) => {
  return (
    <Loader
      error={error}
      loading={loading}
      render={() => {
        if (!me || !me.subscribedTo) return null
        return <FormatCheckboxes subscriptions={me.subscribedTo.nodes} />
      }}
    />
  )
}

export default compose(graphql(mySubscriptions))(SubscribeDocuments)
