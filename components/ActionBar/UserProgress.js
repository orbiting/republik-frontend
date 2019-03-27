import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { styles as iconLinkStyles } from '../IconLink'
import datetime from '../Article/Progress/datetime'

import {
  ProgressCircle, colors, fontStyles
} from '@project-r/styleguide'

const styles = {
  container: css({
    height: '23px'
  }),
  icon: css({
    display: 'inline-block',
    verticalAlign: 'middle',
    marginBottom: -3,
    marginRight: 1,
    height: 18
  }),
  text: css({
    ...fontStyles.sansSerifMedium16,
    fontSize: 15,
    lineHeight: '20px',
    paddingTop: 1
  })
}

const UserProgress = ({ t, fill, userProgress, text }) => {
  const { percentage, updatedAt } = userProgress
  const percent = Math.round(percentage * 100)

  return (
    <div {...iconLinkStyles.link} {...styles.container} title={datetime(t, new Date(updatedAt))}>
      <div {...styles.icon}>
        <ProgressCircle
          progress={percent}
          stroke={fill}
          strokePlaceholder='#e9e9e9'
          radius={9}
          strokeWidth={2} />
      </div>
      <span {...iconLinkStyles.text} {...styles.text} style={{ color: fill }}>
        {text || `${percent}%`}
      </span>
    </div>
  )
}

UserProgress.defaultProps = {
  fill: colors.lightText
}

UserProgress.propTypes = {
  userProgress: PropTypes.object.isRequired,
  style: PropTypes.object
}

export default compose(
  withT
)(UserProgress)
