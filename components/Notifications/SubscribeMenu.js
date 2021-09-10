import React, { useState, useEffect, useMemo } from 'react'
import { flowRight as compose } from 'lodash'
import { graphql } from '@apollo/client/react/hoc'
import { withRouter } from 'next/router'
import { CalloutMenu, IconButton } from '@project-r/styleguide'
import {
  NotificationIcon,
  NotificationsNoneIcon
} from '@project-r/styleguide/icons'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'
import SubscribeCallout from './SubscribeCallout'
import { getSelectedDiscussionPreference } from './SubscribeDebate'
import withMe from '../../lib/apollo/withMe'

const SubscribeMenu = ({
  data,
  router,
  discussionId,
  subscriptions,
  showAuthorFilter,
  userHasNoDocuments,
  label,
  labelShort,
  me,
  padded
}) => {
  const checkIfSubscribedToAny = ({ data, subscriptions }) =>
    //checks if any of the subscription nodes is set to active
    (subscriptions &&
      subscriptions.some(
        subscription =>
          subscription.active &&
          (showAuthorFilter ||
            subscription.object?.__typename !== 'User' ||
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
        subscriptions.filter(node => node.object?.__typename === 'Document'),
      authorSubscriptions:
        subscriptions &&
        subscriptions.filter(
          node =>
            node.object?.__typename === 'User' && node.object?.id !== me?.id
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

  const Icon = React.forwardRef((props, ref) => (
    <IconButton
      Icon={isSubscribedToAny ? NotificationIcon : NotificationsNoneIcon}
      label={label}
      labelShort={labelShort}
      ref={ref}
      {...props}
    />
  ))

  return (
    <CalloutMenu
      padded={padded}
      Element={Icon}
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
  )
}

export default compose(
  graphql(discussionPreferencesQuery, {
    skip: props => !props.discussionId
  }),
  withRouter,
  withMe
)(SubscribeMenu)
