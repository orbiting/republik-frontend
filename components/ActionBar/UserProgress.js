import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import datetime from '../Article/Progress/datetime'
import MdCheckCircleOutlined from '../Icons/MdCheckCircleOutlined'
import { withProgressApi } from '../Article/Progress/api'
import {
  ProgressCircle,
  colors,
  IconButton,
  CalloutMenu
} from '@project-r/styleguide'

const UserProgress = (
  { t, documentId, userProgress, upsertDocumentProgress },
  { restoreArticleProgress }
) => {
  const { percentage, updatedAt } = userProgress
  const percent = Math.round(percentage * 100)
  const fill = restoreArticleProgress ? colors.text : colors.lightText

  const ReadIcon = React.forwardRef((props, ref) => (
    <IconButton
      Icon={MdCheckCircleOutlined}
      label='Gelesen'
      ref={ref}
      {...props}
    />
  ))

  if (percent === 100) {
    return (
      <CalloutMenu Element={ReadIcon}>
        <button
          onClick={() =>
            upsertDocumentProgress(documentId, 0, '')
              .then(res => console.log(res))
              .catch(err => console.log(err))
          }
        >
          Als ungelesen markieren
        </button>
      </CalloutMenu>
    )
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
      onClick={restoreArticleProgress}
      href={restoreArticleProgress ? '#' : undefined}
      title={datetime(t, new Date(updatedAt))}
      label={`Zur Leseposition: ${percent}%`}
      labelShort={`${percent}%`}
    />
  )
}

UserProgress.contextTypes = {
  restoreArticleProgress: PropTypes.func
}

export default compose(withT, withProgressApi)(UserProgress)
