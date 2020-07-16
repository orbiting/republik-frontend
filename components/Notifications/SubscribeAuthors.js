import React from 'react'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'

const SubscribeAuthor = ({
  t,
  subscriptions,
  setAnimate,
  showAuthorFilter,
  userHasNoDocuments,
  style,
  onlyCommentFilter
}) => {
  return (
    <>
      {onlyCommentFilter ? (
        <>
          <h4>{t('SubscribeAuthor/title')}</h4>
          {subscriptions.map(subscription => (
            <SubscribeCheckbox
              key={subscription.id}
              subscription={subscription}
              filterName='Comment'
              setAnimate={setAnimate}
              callout
            />
          ))}
        </>
      ) : showAuthorFilter ? (
        <>
          {subscriptions.map(subscription =>
            (userHasNoDocuments &&
            !(subscription.active && subscription.filters.includes('Document'))
              ? ['Comment']
              : ['Document', 'Comment']
            ).map(filter => (
              <SubscribeCheckbox
                key={`${subscription.id}-${filter}`}
                subscription={subscription}
                filterName={filter}
                filterLabel
                setAnimate={setAnimate}
                callout
              />
            ))
          )}
        </>
      ) : (
        <div style={style}>
          <h4>{t('SubscribeAuthor/title')}</h4>
          {subscriptions.map(subscription => (
            <SubscribeCheckbox
              key={subscription.id}
              subscription={subscription}
              filterName='Document'
              setAnimate={setAnimate}
              callout
            />
          ))}
        </div>
      )}
    </>
  )
}

export default withT(SubscribeAuthor)
