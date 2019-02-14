import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { styles as iconLinkStyles } from '../IconLink'

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
    height: 18
  }),
  text: css({
    ...fontStyles.sansSerifMedium16,
    fontSize: 15,
    lineHeight: '20px',
    color: colors.lightText,
    paddingLeft: 4
  })
}

const UserProgress = ({ t, userProgress }) => {
  const { percentage } = userProgress
  const percent = Math.round(percentage * 100)
  if (!percent) {
    return null
  }

  return (
    <div {...iconLinkStyles.link} {...styles.container} >
      <div {...styles.icon}>
        <ProgressCircle
          progress={percent}
          stroke={colors.lightText}
          strokePlaceholder='#e9e9e9'
          radius={9}
          strokeWidth={2} />
      </div>
      <span {...iconLinkStyles.text} {...styles.text}>
        {percent}%
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
