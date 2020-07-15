import React, { useState, useEffect } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import SubscribeIcon from './SubscribeIcon'
import { compose, graphql } from 'react-apollo'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'
import SubscribeCallout from './SubscribeCallout'
import { withRouter } from 'next/router'
import { getSelectedDiscussionPreference } from './SubscribeDebate'
import { css } from 'glamor'

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
  style,
  label
}) => {
  const checkIfSubscribedToAny = ({ data, subscriptions }) =>
    //checks if any of the subscription nodes is set to active
    (subscriptions &&
      subscriptions.nodes.length &&
      subscriptions.nodes
        .some(node => node.active) ||
    // or if a discussion is being followed
    (data && getSelectedDiscussionPreference(data) !== 'NONE')

  const [formatSubscription, setFormatSubscription] = useState()
  const [authorSubscriptions, setAuthorSubscriptions] = useState()
  const [animate, setAnimate] = useState(false)
  const [isSubscribedToAny, setIsSubscribedToAny] = useState(
    checkIfSubscribedToAny({ data, subscriptions })
  )

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 1 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  useEffect(() => {
    setIsSubscribedToAny(checkIfSubscribedToAny({ data, subscriptions }))
    setFormatSubscription(
      subscriptions &&
        subscriptions.nodes.length &&
        subscriptions.nodes.filter(
          node => node.object.__typename === 'Document'
        )
    )
    setAuthorSubscriptions(
      subscriptions &&
        subscriptions.nodes.length &&
        subscriptions.nodes.filter(node => node.object.__typename === 'User')
    )
  }, [data, subscriptions])

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
          discussionId={discussionId}
          formatSubscription={formatSubscription}
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
  withRouter
)(SubscribeMenu)
