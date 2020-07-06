import React from 'react'
import SubscribeDebate from './SubscribeDebate'
import SubscribeDocument from './SubscribeDocument'
import SubscribeAuthors from './SubscribeAuthors'
import { css } from 'glamor'
import { A, colors, fontFamilies } from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

const styles = {
  container: css({
    minWidth: 180,
    '& h4': {
      margin: '0 0 12px',
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'inherit',
      color: colors.text
    }
  }),
  settings: css({
    margin: '5px 0 0'
  })
}

const SettingsLink = withT(({ t }) => (
  <p {...styles.settings}>
    <small>
      <Link key='link' route='subscriptionsSettings' passHref>
        <A>{t('SubscribeCallout/settingsLink')}</A>
      </Link>
    </small>
  </p>
))

const SubscribeCallout = ({
  discussionId,
  formatSubscription,
  authorSubscriptions,
  setAnimate
}) => {
  console.log(formatSubscription, authorSubscriptions)
  return (
    <div {...styles.container}>
      {discussionId && (
        <SubscribeDebate discussionId={discussionId} setAnimate={setAnimate} />
      )}
      {formatSubscription && formatSubscription.length !== 0 && (
        <SubscribeDocument
          subscriptions={formatSubscription}
          setAnimate={setAnimate}
          style={{ marginTop: discussionId ? 15 : 0 }}
        />
      )}
      {authorSubscriptions && authorSubscriptions.length !== 0 && (
        <SubscribeAuthors
          subscriptions={authorSubscriptions}
          setAnimate={setAnimate}
          style={{ marginTop: discussionId ? 15 : 0 }}
        />
      )}
      <SettingsLink />
    </div>
  )
}

export default SubscribeCallout
