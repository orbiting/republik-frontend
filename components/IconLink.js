import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { prefixHover } from '../lib/utils/hover'

import {
  mediaQueries
} from '@project-r/styleguide'

import AudioIcon from 'react-icons/lib/md/volume-up'
import ChartIcon from 'react-icons/lib/md/insert-chart'
import TimeIcon from './Icons/Time'
import DiscussionIcon from 'react-icons/lib/md/chat-bubble-outline'
import DownloadIcon from 'react-icons/lib/md/file-download'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import FolderIcon from 'react-icons/lib/fa/folder-open'
import GalleryIcon from 'react-icons/lib/md/filter'
import LinkIcon from './Icons/Web'
import MarkdownIcon from 'react-icons/lib/go/markdown'
import MailIcon from 'react-icons/lib/md/mail-outline'
import PdfIcon from 'react-icons/lib/md/picture-as-pdf'
import ShareIcon from 'react-icons/lib/md/share'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import WhatsappIcon from 'react-icons/lib/fa/whatsapp'
import KeyIcon from 'react-icons/lib/fa/key'
import VideoIcon from './Icons/Video'

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
  icon: css({
    verticalAlign: 'middle'
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
  chart: ChartIcon,
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
  pdf: PdfIcon,
  gallery: GalleryIcon,
  time: TimeIcon,
  video: VideoIcon
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
      <span {...styles.icon}>
        <Icon fill={fill} size={size} />
      </span>
      {children && (
        <span
          {...(stacked ? styles.stackedText : styles.text)}
        >
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
