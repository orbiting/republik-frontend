import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { mediaQueries } from '@project-r/styleguide'

const GRADIENT_PADDING_TOP = 180

const styles = {
  cover: css({
    width: '100%',
    position: 'relative',
    height: `calc(75vh - ${HEADER_HEIGHT_MOBILE}px)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '260px',
    [mediaQueries.mUp]: {
      height: `calc(85vh - ${HEADER_HEIGHT}px)`,
      minHeight: '380px'
    }
  }),
  cta: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    color: '#fff',
    backgroundImage: `linear-gradient(-180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.5) ${GRADIENT_PADDING_TOP}px, rgba(0,0,0,.9) 100%)`
  }),
  ctaCenter: css({
    padding: `${GRADIENT_PADDING_TOP}px 20px 0`,
    textAlign: 'center',
    margin: '0 auto',
    maxWidth: 800,
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased'
  })
}

const Cover = ({ image, children }) => (
  <div
    {...styles.cover}
    {...css({
      backgroundImage: `url('${image.srcMobile}')`,
      [mediaQueries.mUp]: { backgroundImage: `url('${image.src}')` }
    })}
  >
    {!!children && (
      <div {...styles.cta}>
        <div {...styles.ctaCenter}>{children}</div>
      </div>
    )}
  </div>
)

Cover.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    srcMobile: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node
}

export default Cover
