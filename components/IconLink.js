import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  mediaQueries,
  colors
} from '@project-r/styleguide'

import AudioIcon from 'react-icons/lib/md/volume-up'
import ChartIcon from './Icons/Chart'
import TimeIcon from './Icons/Time'
import DiscussionIcon from 'react-icons/lib/md/chat-bubble-outline'
import DownloadIcon from 'react-icons/lib/md/file-download'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import FolderIcon from 'react-icons/lib/fa/folder-open'
import GalleryIcon from 'react-icons/lib/md/filter'
import LinkIcon from './Icons/Web'
import MailIcon from 'react-icons/lib/md/mail-outline'
import PdfIcon from 'react-icons/lib/md/picture-as-pdf'
import ShareIcon from 'react-icons/lib/md/share'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import WhatsappIcon from 'react-icons/lib/fa/whatsapp'
import KeyIcon from 'react-icons/lib/fa/key'
import VideoIcon from './Icons/Video'
import MarkdownIcon from './Icons/Markdown'
import EtiquetteIcon from './Icons/Etiquette'

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

const animateKeyframes = css.keyframes({
  '0%': { transform: 'scale(0.8)', opacity: 0 },
  '25%': { opacity: 1 },
  '100%': { transform: 'scale(2)', opacity: 0 }
})

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
    '@media(hover)': {
      '[href]:hover > *': {
        opacity: 0.6
      }
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
    paddingLeft: 3,
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
  }),
  animate: css({
    position: 'absolute',
    opacity: 0,
    marginTop: 1,
    marginLeft: 1,
    border: `1px solid ${colors.primary}`,
    animation: `${animateKeyframes} 1s ease-out 1s 3 forwards`
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
  video: VideoIcon,
  etiquette: EtiquetteIcon
}

const IconLink = ({
  href,
  target,
  fill,
  animate,
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
        {animate && (
          <span style={{ width: size, height: size, borderRadius: size / 2 }} {...styles.animate} />
        )}
        <Icon fill={fill} size={size} />
      </span>
      {children && (
        <span
          {...(stacked ? styles.stackedText : styles.text)}
        >
          {children}
        </span>
      )}
    </a>
  )
}

IconLink.propTypes = {
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired
}

export default IconLink
