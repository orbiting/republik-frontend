import React from 'react'
import { css } from 'glamor'
import MdCheck from 'react-icons/lib/md/check'
import { Link } from '../../lib/routes'

import { colors, fontStyles, mediaQueries } from '@project-r/styleguide'

export const profilePictureSize = 70
export const profilePictureMargin = 10
const profilePictureBorderSize = 5

const styles = {
  root: css({
    display: 'flex',
    alignItems: 'center',
    borderTop: `1px solid ${colors.text}`,
    margin: '0 0 40px 0',
    paddingTop: 12
  }),
  profilePicture: css({
    display: 'block',
    width: `${profilePictureSize + 2 * profilePictureBorderSize}px`,
    flexGrow: 0,
    flexShrink: 0,
    height: `${profilePictureSize + 2 * profilePictureBorderSize}px`,
    marginRight: 15
  }),
  meta: css({
    alignSelf: 'stretch',
    display: 'block',
    flexDirection: 'column',
    justifyContent: 'center',
    width: `calc(100% - ${profilePictureSize + profilePictureMargin}px)`
  }),
  name: css({
    ...fontStyles.sansSerifMedium20,
    lineHeight: '24px',
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 2,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium22
    }
  }),
  description: css({
    ...fontStyles.sansSerifRegular14,
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      lineHeight: '24px'
    }
  }),
  verifiedCheck: css({
    color: colors.primary,
    flexShrink: 0,
    display: 'inline-block',
    marginLeft: 4,
    marginTop: -2
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

export const UserTeaser = ({
  id,
  slug,
  firstName,
  lastName,
  credentials,
  portrait
}) => {
  const credential = credentials && credentials.find(c => c.isListed)
  return (
    <div {...styles.root}>
      {portrait && (
        <Link route='profile' params={{ slug: slug || id }}>
          <a {...styles.link}>
            <img
              {...styles.profilePicture}
              src={portrait}
              alt={`${firstName} ${lastName}`}
            />
          </a>
        </Link>
      )}
      <div {...styles.meta}>
        <div {...styles.name}>
          <Link route='profile' params={{ slug: slug || id }}>
            <a {...styles.link}>
              {firstName} {lastName}
            </a>
          </Link>
        </div>
        {credential && (
          <div {...styles.description}>
            <div
              {...styles.descriptionText}
              style={{
                color: credential.verified ? colors.text : colors.lightText
              }}
            >
              {credential.description}
            </div>
            {credential.verified && <MdCheck {...styles.verifiedCheck} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserTeaser
