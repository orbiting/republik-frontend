import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import datetime from '../Article/Progress/datetime'
import MdCheckCircleOutlined from '../Icons/MdCheckCircleOutlined'
import { MdHighlightOff } from 'react-icons/md'
import { withProgressApi } from '../Article/Progress/api'
import {
  ProgressCircle,
  colors,
  IconButton,
  CalloutMenu
} from '@project-r/styleguide'

const UserProgress = (
  {
    t,
    documentId,
    userProgress,
    upsertDocumentProgress,
    forceShortLabel,
    noCallout,
    noScroll
  },
  { restoreArticleProgress }
) => {
  const { percentage, updatedAt } = userProgress
  const percent = Math.round(percentage * 100)

  const ReadIcon = React.forwardRef((props, ref) => (
    <IconButton
      Icon={MdCheckCircleOutlined}
      label={!forceShortLabel && t('article/actionbar/progress/read')}
      noClick={noCallout}
      ref={ref}
      {...props}
    />
  ))

  if (percent === 100) {
    if (noCallout) {
      return <ReadIcon />
    } else {
      return (
        <CalloutMenu Element={ReadIcon}>
          <IconButton
            Icon={MdHighlightOff}
            label={t('article/actionbar/progress/unread')}
            onClick={() =>
              upsertDocumentProgress(documentId, 0, '')
                .then(res => console.log(res))
                .catch(err => console.log(err))
            }
          />
        </CalloutMenu>
      )
    }
  }

  const ProgressCircleIcon = () => (
    <ProgressCircle
      progress={percent}
      stroke={colors.text}
      strokePlaceholder='#e9e9e9'
      size={24}
      strokeWidth={2}
    />
  )

  return (
    <IconButton
      Icon={ProgressCircleIcon}
      noClick={noScroll}
      onClick={restoreArticleProgress}
      href={restoreArticleProgress ? '#' : undefined}
      title={datetime(t, new Date(updatedAt))}
      label={
        forceShortLabel
          ? `${percent}%`
          : t('progress/restore/title', {
              percent: `${percent}%`
            })
      }
      labelShort={`${percent}%`}
    />
  )
}

UserProgress.contextTypes = {
  restoreArticleProgress: PropTypes.func
}

export default compose(withT, withProgressApi)(UserProgress)
