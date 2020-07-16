import React, { useState, useEffect, useMemo } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import SubscribeIcon from './SubscribeIcon'
import { compose, graphql } from 'react-apollo'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'
import SubscribeCallout from './SubscribeCallout'
import { withRouter } from 'next/router'
import { getSelectedDiscussionPreference } from './SubscribeDebate'
import { css } from 'glamor'
import withMe from '../../lib/apollo/withMe'

const styles = {
  container: css({
    display: 'inline-block',
    marginLeft: 'auto',
    position: 'relative',
    lineHeight: 'initial',
    '@media print': {
      display: 'none'
    }
  })
}

const SubscribeMenu = ({
  data,
  router,
  discussionId,
  subscriptions,
  showAuthorFilter,
  userHasNoDocuments,
  style,
  label,
  me
}) => {
  const checkIfSubscribedToAny = ({ data, subscriptions }) =>
    //checks if any of the subscription nodes is set to active
    (subscriptions &&
      subscriptions.some(
        subscription =>
          subscription.active &&
          (showAuthorFilter ||
            subscription.object.__typename !== 'User' ||
            subscription.filters.includes('Document'))
      )) ||
    // or if a discussion is being followed
    (data && getSelectedDiscussionPreference(data) !== 'NONE')

  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 1 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  const {
    isSubscribedToAny,
    formatSubscriptions,
    authorSubscriptions
  } = useMemo(
    () => ({
      isSubscribedToAny: checkIfSubscribedToAny({ data, subscriptions }),
      formatSubscriptions:
        subscriptions &&
        subscriptions.filter(node => node.object.__typename === 'Document'),
      authorSubscriptions:
        subscriptions &&
        subscriptions.filter(
          node => node.object.__typename === 'User' && node.object.id !== me?.id
        )
    }),
    [data, subscriptions]
  )

  if (
    !formatSubscriptions?.length &&
    !authorSubscriptions?.length &&
    !discussionId
  ) {
    return null
  }

  const icon = (
    <SubscribeIcon animate={animate} isSubscribed={isSubscribedToAny} />
  )
  return (
    <div {...styles.container} style={style}>
      <CalloutMenu
        label={label}
        icon={icon}
        initiallyOpen={router.query && !!router.query.mute}
      >
        <SubscribeCallout
          showAuthorFilter={showAuthorFilter}
          userHasNoDocuments={userHasNoDocuments}
          discussionId={discussionId}
          formatSubscriptions={formatSubscriptions}
          authorSubscriptions={authorSubscriptions}
          setAnimate={setAnimate}
        />
      </CalloutMenu>
    </div>
  )
}

export default compose(
  graphql(discussionPreferencesQuery, {
    skip: props => !props.discussionId
  }),
  withRouter,
  withMe
)(SubscribeMenu)
