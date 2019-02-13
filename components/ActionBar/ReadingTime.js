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

const ReadingTime = ({ t, minutes, fill, small, style }) => {
  const size = small ? 20 : 22
  const fontSize = small ? '15px' : undefined
  const lineHeight = small ? '20px' : undefined

  const displayHours = Math.floor(minutes / 60)
  const displayMinutes = minutes % 60

  return (
    <IconLink
      icon='time'
      fill={fill}
      size={size}
      title={t.pluralize(
        'feed/actionbar/readingTime',
        { minutes }
      )}
      style={{
        color: fill || undefined,
        marginLeft: 5,
        ...style
      }}>
      <span {...styles.text} style={{ fontSize, lineHeight }}>
        {!!displayHours && `${displayHours}h\u202F`}
        {displayMinutes}{'\''}
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

export default compose(
  withT
)(ReadingTime)
