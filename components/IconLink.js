import React from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import { linkRule } from '@project-r/styleguide'

import DiscussionIcon from 'react-icons/lib/md/chat-bubble-outline'
import DownloadIcon from 'react-icons/lib/md/file-download'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import FolderIcon from 'react-icons/lib/fa/folder-open'
import LinkIcon from 'react-icons/lib/md/link'
import MailIcon from 'react-icons/lib/md/mail-outline'
import PersonIcon from 'react-icons/lib/md/person'
import PersonOutlineIcon from 'react-icons/lib/md/person-outline'
import ShareIcon from 'react-icons/lib/md/share'
import StarIcon from 'react-icons/lib/md/star'
import StarBorderIcon from 'react-icons/lib/md/star-border'
import TwitterIcon from 'react-icons/lib/fa/twitter'

const DEFAULT_SIZE = 24
const DEFAULT_PADDING = 5

const styles = {
  link: {
    maxWidth: '100%',
    textDecoration: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    width: '100%',
    ':hover > span': {
      opacity: 0.6
    },
    ':first-child': {
      paddingLeft: 0
    },
    ':last-child': {
      paddingRight: 0
    }
  },
  icon: css({
    ':hover': {
      opacity: 0.6
    }
  }),
  text: {
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    verticalAlign: 'middle'
  }
}

const ICONS = {
  discussion: DiscussionIcon,
  download: DownloadIcon,
  facebook: FacebookIcon,
  dossier: FolderIcon,
  link: LinkIcon,
  mail: MailIcon,
  author: PersonIcon,
  freelancer: PersonOutlineIcon,
  share: ShareIcon,
  crowdfunder: StarBorderIcon,
  patron: StarIcon,
  twitter: TwitterIcon
}

const IconLink = ({
  href,
  target,
  fill,
  icon,
  size,
  text,
  textSize,
  textColor,
  padding
}) => {
  const Icon = ICONS[icon]
  const paddingValue = padding !== undefined ? padding : DEFAULT_PADDING
  const sizeValue = size || DEFAULT_SIZE
  return (
    <a
      href={href}
      {...merge(styles.link, {
        padding: `${paddingValue}px`
      })}
      target={target}
    >
      <span {...styles.icon}>
        <Icon fill={fill} size={sizeValue} />
      </span>
      {text && (
        <span
          {...merge(
            styles.text,
            { maxWidth: `calc(100% - ${sizeValue + 2 * paddingValue}px)` },
            href && !textColor ? linkRule : {},
            textColor ? { color: textColor } : {},
            textSize ? { fontSize: textSize } : {}
          )}
        >
          &nbsp;{text}
        </span>
      )}
    </a>
  )
}

IconLink.propTypes = {
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired
}

export default IconLink
