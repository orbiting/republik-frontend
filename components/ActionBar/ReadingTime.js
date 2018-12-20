import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import IconLink from '../IconLink'

import {
  colors, fontStyles
} from '@project-r/styleguide'

const styles = {
  text: css({
    ...fontStyles.sansSerifMedium16
  })
}

const ReadingTime = ({ minutes, fill, small }) => {
  const size = small ? 20 : 22
  const fontSize = small ? '15px' : undefined
  return (
    <IconLink icon='time' fill={fill} size={size} style={{
      color: fill || undefined,
      fontSize,
      marginLeft: 5
    }}>
      <span {...styles.text}>{minutes}'</span>
    </IconLink>
  )
}

ReadingTime.defaultProps = {
  fill: colors.lightText
}

ReadingTime.propTypes = {
  minutes: PropTypes.number.isRequired,
  fill: PropTypes.string,
  small: PropTypes.bool
}

export default compose(
  withT
)(ReadingTime)
