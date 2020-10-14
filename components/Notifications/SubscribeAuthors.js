import React from 'react'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'
import { css } from 'glamor'
import { Interaction, fontFamilies } from '@project-r/styleguide'

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
          <Interaction.P {...styles.title}>
            {t('SubscribeMenu/title')}
          </Interaction.P>
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
          <Interaction.P {...styles.title}>
            {t('SubscribeMenu/title')}
          </Interaction.P>
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

const styles = {
  title: css({
    margin: '0 0 12px',
    fontWeight: 'inherit'
  })
}

export default withT(SubscribeAuthor)
