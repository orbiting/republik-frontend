import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import DiscussionIcon from 'react-icons/lib/md/chat-bubble-outline'
import DownloadIcon from 'react-icons/lib/md/file-download'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import FolderIcon from 'react-icons/lib/fa/folder-open'
import LinkIcon from './Icons/Web'
import MailIcon from 'react-icons/lib/md/mail-outline'
import ShareIcon from 'react-icons/lib/md/share'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import KeyIcon from 'react-icons/lib/fa/key'

const DEFAULT_SIZE = 24
const DEFAULT_PADDING = 5

const styles = {
  link: css({
    color: 'inherit',
    display: 'inline-block',
    maxWidth: '100%',
    textDecoration: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    paddingLeft: DEFAULT_PADDING,
    paddingRight: DEFAULT_PADDING,
    ':hover > *': {
      opacity: 0.6
    },
    ':first-child': {
      paddingLeft: 0
    },
    ':last-child': {
      paddingRight: 0
    }
  }),
  text: css({
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    verticalAlign: 'middle'
  })
}

const ICONS = {
  discussion: DiscussionIcon,
  download: DownloadIcon,
  facebook: FacebookIcon,
  dossier: FolderIcon,
  link: LinkIcon,
  mail: MailIcon,
  share: ShareIcon,
  twitter: TwitterIcon,
  key: KeyIcon
}

const IconLink = ({
  href,
  target,
  fill,
  icon,
  children,
  size = DEFAULT_SIZE,
  style,
  title
}) => {
  const Icon = ICONS[icon]

  return (
    <a
      {...styles.link}
      href={href}
      style={style}
      target={target}
      title={title}
    >
      <Icon fill={fill} size={size} />
      {children && (
        <span {...styles.text}>
          &nbsp;{children}
        </span>
      )}
    </a>
  )
}

IconLink.propTypes = {
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired
}

export default IconLink
