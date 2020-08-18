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
    noCallout
  },
  { restoreArticleProgress }
) => {
  const { percentage, updatedAt } = userProgress
  const percent = Math.round(percentage * 100)
  const fill = restoreArticleProgress ? colors.text : colors.lightText

  const ReadIcon = React.forwardRef((props, ref) => (
    <IconButton
      Icon={MdCheckCircleOutlined}
      label='Gelesen'
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
            label='Als ungelesen markieren'
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

  const Icon = () => (
    <ProgressCircle
      progress={percent}
      stroke={fill}
      strokePlaceholder='#e9e9e9'
      size={24}
      strokeWidth={2}
    />
  )

  return (
    <IconButton
      Icon={Icon}
      noClick={noCallout}
      onClick={restoreArticleProgress}
      href={restoreArticleProgress ? '#' : undefined}
      title={datetime(t, new Date(updatedAt))}
      label={forceShortLabel ? `${percent}%` : `Zur Leseposition: ${percent}%`}
      labelShort={`${percent}%`}
    />
  )
}

UserProgress.contextTypes = {
  restoreArticleProgress: PropTypes.func
}

export default compose(withT, withProgressApi)(UserProgress)
