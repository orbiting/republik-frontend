import React, { useState, useEffect, useMemo } from 'react'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { withRouter } from 'next/router'
import { CalloutMenu, IconButton } from '@project-r/styleguide'
import { NotificationIcon, NotificationsNoneIcon } from '@project-r/styleguide'
import SubscribeCallout from './SubscribeCallout'
import { getSelectedDiscussionPreference } from './SubscribeDebate'
import withMe from '../../lib/apollo/withMe'
import { DISCUSSION_PREFERENCES_QUERY } from '../Discussion/DiscussionProvider/graphql/DiscussionPreferencesQuery.graphql'

const checkIfSubscribedToAny = ({ data, subscriptions, showAuthorFilter }) =>
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
  padded,
  loading,
  attributes
}) => {
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
      isSubscribedToAny: checkIfSubscribedToAny({
        data,
        subscriptions,
        showAuthorFilter
      }),
      formatSubscriptions:
        subscriptions &&
        subscriptions.filter(node => node.object?.__typename === 'Document'),
      authorSubscriptions:
        subscriptions &&
        subscriptions.filter(node => node.object?.__typename === 'User')
    }),
    [data, subscriptions]
  )

  // ensure icon is only shown if there is something to subscribe to
  if (
    !loading &&
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
      disabled={loading}
      {...props}
    />
  ))

  return (
    <CalloutMenu
      padded={padded}
      Element={Icon}
      initiallyOpen={router.query && !!router.query.mute}
      attributes={attributes}
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
  graphql(DISCUSSION_PREFERENCES_QUERY, {
    skip: props => !props.discussionId
  }),
  withRouter,
  withMe
)(SubscribeMenu)
