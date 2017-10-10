import React from 'react'
import {css} from 'glamor'
import {fontFamilies} from '@project-r/styleguide/lib/theme/fonts'

import {MdCheck} from 'react-icons/lib/md'

const commentHeaderStyles = {
  root: css({
    display: 'flex',
    alignItems: 'center'
  }),
  profilePicture: css({
    display: 'block',
    width: '40px',
    height: '40px',
    marginRight: 10
  }),
  meta: css({
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }),
  name: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: '15px',
    lineHeight: '20px',
    color: '#282828'
  }),
  timeago: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: '12px',
    color: '#979797'
  }),
  description: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: '12px',
    lineHeight: '15px',
    marginTop: '5px'
  }),
  verifiedCheck: css({
    display: 'inline-block',
    marginLeft: 4,
    marginTop: -2
  })
}

export const CommentHeader = ({profilePicture, name, timeago, credential}) => (
  <div {...commentHeaderStyles.root}>
    {profilePicture && <img
      {...commentHeaderStyles.profilePicture}
      src={profilePicture}
    />}
    <div {...commentHeaderStyles.meta}>
      <div {...commentHeaderStyles.name}>
        {name}
        {timeago && <span {...commentHeaderStyles.timeago}>・{timeago}</span>}
      </div>
      {credential && <div {...commentHeaderStyles.description}>
        {credential.description}
        {credential.verified && <MdCheck {...commentHeaderStyles.verifiedCheck} />}
      </div>}
    </div>
  </div>
)

export default CommentHeader
