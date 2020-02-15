import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { mediaQueries, colors, useColorContext } from '@project-r/styleguide'

import AudioIcon from 'react-icons/lib/md/volume-up'
import ChartIcon from './Icons/Chart'
import TimeIcon from './Icons/Time'
import ShareIOSIcon from './Icons/ShareIOS'
import DiscussionIcon from 'react-icons/lib/md/chat-bubble-outline'
import DownloadIcon from 'react-icons/lib/md/file-download'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import FolderIcon from 'react-icons/lib/fa/folder-open'
import FontSizeIcon from './Icons/FontSize'
import GalleryIcon from 'react-icons/lib/md/filter'
import LinkIcon from './Icons/Web'
import CopyLinkIcon from 'react-icons/lib/md/link'
import MailIcon from 'react-icons/lib/md/mail-outline'
import PdfIcon from 'react-icons/lib/md/picture-as-pdf'
import ShareIcon from 'react-icons/lib/md/share'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import WhatsappIcon from 'react-icons/lib/fa/whatsapp'
import PocketIcon from 'react-icons/lib/fa/get-pocket'
import KeyIcon from 'react-icons/lib/fa/key'
import VideoIcon from './Icons/Video'
import MarkdownIcon from './Icons/Markdown'
import EtiquetteIcon from './Icons/Etiquette'
import EditIcon from 'react-icons/lib/fa/edit'
import LaunchIcon from 'react-icons/lib/md/launch'
import RSSIcon from 'react-icons/lib/md/rss-feed'
import PlayIcon from 'react-icons/lib/md/play-circle-outline'
import SpotifyIcon from 'react-icons/lib/fa/spotify'

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

const solidScaleframes = css.keyframes({
  '0%': { transform: 'scale(0)' },
  '50%': { transform: 'scale(1.5)' },
  '100%': { transform: 'scale(1.5)' }
})

const solidOpacityKeyframes = css.keyframes({
  from: { opacity: 0.2 },
  to: { opacity: 0 }
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
    position: 'relative',
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
  solid: css({
    position: 'absolute',
    top: 0.5,
    left: 0,
    borderRadius: '50%',
    backgroundColor: colors.primary,
    animation: [
      `${solidScaleframes} 1.8s cubic-bezier(0.8, 0, 0.8, 1) alternate both`,
      `${solidOpacityKeyframes} 1.3s cubic-bezier(0.8, 0, 0.8, 1) both`
    ].join(',')
  })
}

const ICONS = {
  copyLink: CopyLinkIcon,
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
  shareIOS: ShareIOSIcon,
  twitter: TwitterIcon,
  whatsapp: WhatsappIcon,
  pocket: PocketIcon,
  key: KeyIcon,
  pdf: PdfIcon,
  gallery: GalleryIcon,
  time: TimeIcon,
  video: VideoIcon,
  etiquette: EtiquetteIcon,
  fontSize: FontSizeIcon,
  edit: EditIcon,
  launch: LaunchIcon,
  rss: RSSIcon,
  play: PlayIcon,
  spotify: SpotifyIcon
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
  const [colorScheme] = useColorContext()
  const Icon = ICONS[icon]
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const ref = useRef()
  const computedFill = fill || colorScheme.text

  useEffect(() => {
    if (
      !animate ||
      !(
        'IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'isIntersecting' in window.IntersectionObserverEntry.prototype
      )
    ) {
      return
    }
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!shouldAnimate && entry.isIntersecting) {
          setShouldAnimate(true)
        }
      },
      { thresholds: 1 }
    )
    observer.observe(ref.current)
    return () => {
      observer.unobserve(ref.current)
    }
  }, [animate])

  return (
    <a
      {...styles.link}
      {...getExtraStyles(mobileOnly, stacked)}
      href={href}
      onClick={onClick}
      style={style}
      target={target}
      rel={target === '_blank' ? 'noopener' : ''}
      title={title}
    >
      <span {...styles.icon} ref={ref}>
        {shouldAnimate && (
          <span {...styles.solid} style={{ width: size, height: size }} />
        )}
        <Icon
          fill={computedFill}
          size={size}
          {...(shouldAnimate &&
            css({
              position: 'relative',
              animation: `${css.keyframes({
                '0%': { fill: computedFill },
                '33%': { fill: colors.primary },
                '100%': { fill: computedFill }
              })} 2.5s cubic-bezier(0.6, 0, 0.6, 1) alternate`
            }))}
        />
      </span>
      {children && (
        <span {...(stacked ? styles.stackedText : styles.text)}>
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
