import React from 'react'

import { IconButton, colors } from '@project-r/styleguide'
import DiscussionIcon from '../Icons/Discussion'
import { focusSelector } from '../../lib/utils/scroll'

import { withDiscussionCommentsCount } from '../Discussion/graphql/enhancers/withDiscussionCommentsCount'

const DiscussionButton = ({
  t,
  discussionId,
  discussionPath,
  discussionQuery,
  discussionCount,
  isDiscussionPage,
  forceShortLabel
}) => {
  return (
    <IconButton
      Icon={DiscussionIcon}
      href={isDiscussionPage ? '#' : discussionPath}
      label={
        forceShortLabel
          ? discussionCount
          : t('profile/documents/title/other', { count: discussionCount })
      }
      labelShort={discussionCount}
      query={discussionQuery}
      fill={colors.primary}
      onClick={
        isDiscussionPage
          ? e => {
              e.preventDefault()
              focusSelector(`[data-discussion-id='${discussionId}']`)
            }
          : undefined
      }
    />
  )
}

export default withDiscussionCommentsCount(DiscussionButton)

export const DiscussionButtonLinkWithoutEnhancer = DiscussionButton
