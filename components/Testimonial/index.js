import React, { Component } from 'react'
import { compose } from 'redux'
import withT from '../../lib/withT'
import { css, merge } from 'glamor'
import IconLink from '../IconLink'
import { TESTIMONIAL_IMAGE_SIZE } from '../constants'
import { fontStyles, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    paddingLeft: `${TESTIMONIAL_IMAGE_SIZE + 20}px`,
    height: `${TESTIMONIAL_IMAGE_SIZE}px`,
    position: 'relative',
    [mediaQueries.onlyS]: {
      paddingLeft: 0,
      height: 'auto'
    }
  }),
  textContainer: css({
    position: 'relative'
  }),
  profileImage: {
    backgroundSize: 'cover',
    height: TESTIMONIAL_IMAGE_SIZE,
    left: 0,
    position: 'absolute',
    top: 0,
    width: TESTIMONIAL_IMAGE_SIZE,
    [mediaQueries.onlyS]: {
      position: 'static'
    }
  },
  quote: {
    ...fontStyles.serifBold36,
    lineHeight: 1.42
  },
  sequenceNumber: css({
    ...fontStyles.serifBold16,
    bottom: '10px',
    position: 'absolute',
    [mediaQueries.onlyS]: {
      position: 'static'
    }
  }),
  actionBar: css({
    bottom: '10px',
    right: 0,
    position: 'absolute',
    [mediaQueries.onlyS]: {
      margin: '10px 0',
      position: 'static'
    }
  }),
  icon: {
    margin: '0 5px 0 0'
  }
}

const fontSizeBoost = length => {
  if (length < 40) {
    return 26
  }
  if (length < 50) {
    return 17
  }
  if (length < 80) {
    return 8
  }
  if (length < 100) {
    return 4
  }
  if (length > 200) {
    return -4
  }
  return 0
}

class Testimonial extends Component {
  render () {
    const { t, testimonial } = this.props

    return (
      <div>
        <div {...styles.container}>
          <div
            {...merge(styles.profileImage, {
              backgroundImage: `url(${testimonial.image})`
            })}
          />
          <div {...styles.textContainer}>
            {testimonial.quote && (
              <p
                {...css(styles.quote)}
                style={{
                  fontSize: 24 + fontSizeBoost(testimonial.quote.length)
                }}
              >
                «{testimonial.quote}»
              </p>
            )}
          </div>
          <div {...styles.sequenceNumber}>
            {t('memberships/sequenceNumber/label', {
              sequenceNumber: testimonial.sequenceNumber
            })}
          </div>
          <div {...styles.actionBar}>
            <IconLink icon='share' />
            <IconLink icon='download' />
          </div>
        </div>
      </div>
    )
  }
}

export default compose(withT)(Testimonial)
