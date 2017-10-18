import React, { Component } from 'react'
import { css } from 'glamor'
import IconLink from '../IconLink'
import {
  BASE_URL_FACEBOOK,
  BASE_URL_TWITTER,
  TESTIMONIAL_IMAGE_SIZE
} from '../constants'
import { colors, fontStyles, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    borderTop: `1px solid ${colors.divider}`,
    paddingTop: '80px',
    position: 'relative',
    paddingLeft: `${TESTIMONIAL_IMAGE_SIZE + 20}px`,
    [mediaQueries.onlyS]: {
      paddingLeft: 0,
      paddingTop: '10px'
    }
  }),
  contact: css({
    ...fontStyles.sansSerifRegular14,
    '& + &': {
      marginTop: '5px'
    }
  })
}

class PointerList extends Component {
  render () {
    const { publicUser } = this.props
    if (!publicUser) {
      return null
    }

    return (
      <span>
        {publicUser.facebookId && (
          <div {...styles.contact}>
            <IconLink
              icon='facebook'
              text={publicUser.facebookId}
              href={`${BASE_URL_FACEBOOK}/${publicUser.facebookId}`}
            />
          </div>
        )}
        {publicUser.twitterHandle && (
          <div {...styles.contact}>
            <IconLink
              icon='twitter'
              text={publicUser.twitterHandle}
              href={`${BASE_URL_TWITTER}/${publicUser.twitterHandle}`}
            />
          </div>
        )}
        {publicUser.email && (
          <div {...styles.contact}>
            <IconLink
              icon='mail'
              text={publicUser.email}
              href={`mailto:${publicUser.email}`}
            />
          </div>
        )}
        {publicUser.publicUrl && (
          <div {...styles.contact}>
            <IconLink
              icon='link'
              text={publicUser.publicUrl}
              href={publicUser.publicUrl}
              target={'_blank'}
            />
          </div>
        )}
      </span>
    )
  }
}

export default PointerList
