import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { styles as iconLinkStyles } from '../IconLink'
import datetime from '../Article/Progress/datetime'

import {
  ProgressCircle,
  colors,
  fontStyles,
  plainButtonRule
} from '@project-r/styleguide'

const UserProgress = (
  { t, userProgress, text, small },
  { restoreArticleProgress }
) => {
  const { percentage, updatedAt } = userProgress
  const percent = Math.round(percentage * 100)

  const Wrapper = restoreArticleProgress ? 'button' : 'div'
  const fill = restoreArticleProgress ? colors.text : colors.lightText

  const textStyle = {
    color: fill,
    ...fontStyles.sansSerifMedium16,
    ...(small
      ? {
          fontSize: 15,
          lineHeight: '20px'
        }
      : {})
  }

  return (
    <Wrapper
      {...plainButtonRule}
      {...iconLinkStyles.link}
      onClick={restoreArticleProgress}
      href={restoreArticleProgress ? '#' : undefined}
      title={datetime(t, new Date(updatedAt))}
    >
      <span {...iconLinkStyles.icon} style={{ paddingRight: 1 }}>
        <ProgressCircle
          progress={percent}
          stroke={fill}
          strokePlaceholder='#e9e9e9'
          radius={small ? 8.5 : 9.5}
          strokeWidth={small ? 2 : 2.5}
        />
      </span>
      <span {...iconLinkStyles.text} style={textStyle}>
        {text || `${percent}%`}
      </span>
    </Wrapper>
  )
}

UserProgress.propTypes = {
  userProgress: PropTypes.object.isRequired,
  style: PropTypes.object
}

UserProgress.contextTypes = {
  restoreArticleProgress: PropTypes.func
}

export default compose(withT)(UserProgress)
