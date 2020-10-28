import React from 'react'
import SubscribeDebate from './SubscribeDebate'
import SubscribeDocument from './SubscribeDocument'
import SubscribeAuthors from './SubscribeAuthors'
import { css } from 'glamor'
import { A, fontFamilies } from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

const styles = {
  container: css({
    minWidth: 180
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
  formatSubscriptions,
  authorSubscriptions,
  showAuthorFilter,
  userHasNoDocuments,
  setAnimate,
  me
}) => {
  const authorSubscriptionsWithoutMe = authorSubscriptions?.filter(
    subscription => subscription.object.id !== me?.id
  )
  return (
    <div {...styles.container}>
      {formatSubscriptions && formatSubscriptions.length !== 0 && (
        <SubscribeDocument
          subscriptions={formatSubscriptions}
          setAnimate={setAnimate}
          style={{ marginBottom: 15 }}
        />
      )}
      {authorSubscriptionsWithoutMe &&
        authorSubscriptionsWithoutMe.length !== 0 && (
          <SubscribeAuthors
            onlyCommentFilter={discussionId}
            showAuthorFilter={showAuthorFilter}
            userHasNoDocuments={userHasNoDocuments}
            subscriptions={authorSubscriptionsWithoutMe}
            setAnimate={setAnimate}
            style={{ marginBottom: 15 }}
          />
        )}
      {discussionId && (
        <SubscribeDebate
          discussionId={discussionId}
          setAnimate={setAnimate}
          style={{ marginBottom: 15 }}
        />
      )}
      <SettingsLink />
    </div>
  )
}

export default withMe(SubscribeCallout)
