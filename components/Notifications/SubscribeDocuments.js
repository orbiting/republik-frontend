import React from 'react'
import { compose, graphql } from 'react-apollo'
import { mySubscriptions } from './enhancers'
import { linkRule, mediaQueries, A } from '@project-r/styleguide'
import Loader from '../Loader'
import { css } from 'glamor'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

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

const EmptyState = withT(({ t }) => (
  <p>
    {t('Notifications/settings/formats/empty')}{' '}
    <A href='/einrichten?section=subscriptions' {...linkRule}>
      {t('Notifications/settings/formats/empty/link')}
    </A>
  </p>
))

const FormatCheckboxes = withT(({ t, subscriptions }) => {
  const documentSubscriptions = subscriptions.filter(
    subscription => subscription.object.__typename === 'Document'
  )
  return (
    <>
      <div style={{ marginTop: 20 }}>
        <p>
          {t.pluralize('Notifications/settings/formats/summary', {
            count: documentSubscriptions.filter(s => s.active).length
          })}
        </p>
      </div>
      <div {...styles.checkboxes}>
        {documentSubscriptions.map((subscription, i) => (
          <SubscribeDocumentCheckbox
            subscription={subscription}
            format={subscription.object}
            key={i}
          />
        ))}
      </div>
      <div>
        <Link route='sections' passHref>
          <a {...linkRule}>{t('Notifications/settings/formats/link')}</a>
        </Link>
      </div>
    </>
  )
})

const SubscribeDocuments = ({ data: { error, loading, me } }) => {
  return (
    <Loader
      error={error}
      loading={loading}
      render={() => {
        if (!me || !me.subscribedTo) return null
        if (!me.subscribedTo.nodes || !me.subscribedTo.nodes.length) {
          return <EmptyState />
        }
        return <FormatCheckboxes subscriptions={me.subscribedTo.nodes} />
      }}
    />
  )
}

export default compose(graphql(mySubscriptions))(SubscribeDocuments)
