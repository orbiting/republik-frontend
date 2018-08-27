import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Link from '../Link/Href'

import {
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    ...fontStyles.sansSerifMedium16,
    display: 'inline-block',
    padding: 0,
    cursor: 'pointer',
    margin: '0 10px 5px 0',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium19,
      margin: '0 20px 5px 0'
    }
  }),
  count: css({
    ...fontStyles.sansSerifMedium12,
    color: '#b4b4b4',
    marginLeft: 5,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium14
    }
  }),
  link: css({
    textDecoration: 'none'
  })
}

class FormatTag extends Component {
  render () {
    const { label, count, color, path } = this.props
    if (!count) return null
    return (
      <div {...styles.container}>
        <Link href={path} passHref>
          <a {...styles.link} href={path} style={{ color }}>
            {label}
            <span {...styles.count}>{count}</span>
          </a>
        </Link>
      </div>
    )
  }
}

FormatTag.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  color: PropTypes.string,
  path: PropTypes.string
}

export default FormatTag
