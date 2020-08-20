import React from 'react'

import { IconButton, colors } from '@project-r/styleguide'
import DiscussionIcon from '../Icons/Discussion'
import { focusSelector } from '../../lib/utils/scroll'
import PathLink from '../Link/Path'
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
    <PathLink path={discussionPath} query={discussionQuery} passHref>
      <IconButton
        Icon={DiscussionIcon}
        label={
          forceShortLabel
            ? discussionCount
            : t('profile/documents/title/other', { count: discussionCount })
        }
        labelShort={discussionCount}
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
    </PathLink>
  )
}

export default withDiscussionCommentsCount(DiscussionButton)
