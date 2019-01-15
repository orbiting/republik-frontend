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
        {minutes}{'\''}
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
