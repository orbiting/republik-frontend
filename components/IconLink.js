import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { prefixHover } from '../lib/utils/hover'

import {
  mediaQueries
} from '@project-r/styleguide'

import AudioIcon from 'react-icons/lib/md/volume-up'
import DiscussionIcon from 'react-icons/lib/md/chat-bubble-outline'
import DownloadIcon from 'react-icons/lib/md/file-download'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import FolderIcon from 'react-icons/lib/fa/folder-open'
import LinkIcon from './Icons/Web'
import MarkdownIcon from 'react-icons/lib/go/markdown'
import MailIcon from 'react-icons/lib/md/mail-outline'
import PdfIcon from 'react-icons/lib/md/picture-as-pdf'
import ShareIcon from 'react-icons/lib/md/share'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import WhatsappIcon from 'react-icons/lib/fa/whatsapp'
import KeyIcon from 'react-icons/lib/fa/key'

const DEFAULT_SIZE = 24
const DEFAULT_PADDING = 5

const stackedStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const mobileOnlyStyle = {
  [mediaQueries.mUp]: {
    display: 'none'
  }
}

const getExtraStyles = (mobileOnly, stacked) => {
  return css({
    ...(stacked && stackedStyle),
    ...(mobileOnly && mobileOnlyStyle)
  })
}

export const styles = {
  link: css({
    color: 'inherit',
    display: 'inline-block',
    maxWidth: '100%',
    textDecoration: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    paddingLeft: DEFAULT_PADDING,
    paddingRight: DEFAULT_PADDING,
    [prefixHover('[href]:hover > *')]: {
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
  }),
  stackedText: css({
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginTop: 5
  }),
  mobileOnly: css({
    [mediaQueries.mUp]: {
      display: 'none'
    }
  })
}

const ICONS = {
  audio: AudioIcon,
  discussion: DiscussionIcon,
  download: DownloadIcon,
  facebook: FacebookIcon,
  dossier: FolderIcon,
  link: LinkIcon,
  mail: MailIcon,
  markdown: MarkdownIcon,
  share: ShareIcon,
  twitter: TwitterIcon,
  whatsapp: WhatsappIcon,
  key: KeyIcon,
  pdf: PdfIcon
}

const IconLink = ({
  href,
  target,
  fill,
  icon,
  children,
  size = DEFAULT_SIZE,
  mobileOnly,
  style,
  title,
  onClick,
  stacked
}) => {
  const Icon = ICONS[icon]

  return (
    <a
      {...styles.link}
      {...(getExtraStyles(mobileOnly, stacked))}
      href={href}
      onClick={onClick}
      style={style}
      target={target}
      rel={target === '_blank' ? 'noopener' : ''}
      title={title}
    >
      <Icon fill={fill} size={size} />
      {children && (
        <span {...(stacked ? styles.stackedText : styles.text)}>
          {!stacked && (
            <Fragment>&nbsp;</Fragment>
          )}{children}
        </span>
      )}
    </a>
  )
}

IconLink.propTypes = {
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired
}

export default IconLink
