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
    position: 'relative'
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
    width: TESTIMONIAL_IMAGE_SIZE
  },
  quote: {
    ...fontStyles.serifBold36,
    [mediaQueries.onlyS]: {
      ...fontStyles.serifBold24
    }
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
              <p {...css(styles.quote)}>«{testimonial.quote}»</p>
            )}
          </div>
          <div {...styles.sequenceNumber}>
            {t('testimonial/sequenceNumber', {
              num: testimonial.sequenceNumber
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
