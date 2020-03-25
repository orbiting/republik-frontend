import React from 'react'
import SubscribeDebate from './SubscribeDebate'
import SubscribeDocument from './SubscribeDocument'
import { css } from 'glamor'
import { A, fontFamilies } from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

const styles = {
  container: css({
    '& h4': {
      margin: '0 0 12px',
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'inherit'
    }
  }),
  settings: css({
    whiteSpace: 'nowrap',
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

const SubscribeCallout = ({ discussionId, subscription, setAnimate }) => {
  return (
    <div {...styles.container}>
      {discussionId && (
        <SubscribeDebate discussionId={discussionId} setAnimate={setAnimate} />
      )}
      {subscription && (
        <SubscribeDocument
          subscription={subscription}
          setAnimate={setAnimate}
          style={{ marginTop: discussionId ? 15 : 0 }}
        />
      )}
      <SettingsLink />
    </div>
  )
}

export default SubscribeCallout
