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
    const { user } = this.props
    if (!user) {
      return null
    }

    return (
      <span>
        {user.facebookId && (
          <div {...styles.contact}>
            <IconLink
              icon='facebook'
              text={user.facebookId}
              href={`${BASE_URL_FACEBOOK}/${user.facebookId}`}
            />
          </div>
        )}
        {user.twitterHandle && (
          <div {...styles.contact}>
            <IconLink
              icon='twitter'
              text={user.twitterHandle}
              href={`${BASE_URL_TWITTER}/${user.twitterHandle}`}
            />
          </div>
        )}
        {/* API will return email if it's your own profile (or authorized roles) */}
        {/* therefore we check isEmailPublic here as well */}
        {user.email && user.isEmailPublic && (
          <div {...styles.contact}>
            <IconLink
              icon='mail'
              text={user.email}
              href={`mailto:${user.email}`}
            />
          </div>
        )}
        {user.publicUrl && (
          <div {...styles.contact}>
            <IconLink
              icon='link'
              text={user.publicUrl.replace(/^https?:\/\/(www.)?/g, '')}
              href={user.publicUrl}
              target={'_blank'}
            />
          </div>
        )}
      </span>
    )
  }
}

export default PointerList
