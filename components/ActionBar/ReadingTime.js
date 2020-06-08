import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import IconLink from '../IconLink'

import { colors, fontStyles } from '@project-r/styleguide'

const ReadingTime = ({ t, minutes, fill, small, style }) => {
  const size = small ? 20 : 22

  const displayHours = Math.floor(minutes / 60)
  const displayMinutes = minutes % 60

  const textStyle = {
    ...fontStyles.sansSerifMedium16,
    ...(small
      ? {
          fontSize: 15,
          lineHeight: '20px'
        }
      : {})
  }

  return (
    <IconLink
      icon='time'
      fill={fill}
      size={size}
      title={t.pluralize('feed/actionbar/readingTime', { minutes })}
      style={{
        color: fill || undefined,
        marginLeft: 5,
        ...style
      }}
    >
      <span style={textStyle}>
        {!!displayHours && `${displayHours}h\u202F`}
        {displayMinutes}
        {"'"}
      </span>
    </IconLink>
  )
}

ReadingTime.defaultProps = {
  fill: colors.lightText
}

ReadingTime.propTypes = {
  minutes: PropTypes.number.isRequired,
  fill: PropTypes.string,
  small: PropTypes.bool,
  style: PropTypes.object
}

export default compose(withT)(ReadingTime)
