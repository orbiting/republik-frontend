import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { mediaQueries, colors, useColorContext } from '@project-r/styleguide'

import ChartIcon from './Icons/Chart'
import TimeIcon from './Icons/Time'
import ShareIOSIcon from './Icons/ShareIOS'
import FontSizeIcon from './Icons/FontSize'
import LinkIcon from './Icons/Web'
import VideoIcon from './Icons/Video'
import MarkdownIcon from './Icons/Markdown'
import EtiquetteIcon from './Icons/Etiquette'

import {
  MdVolumeUp,
  MdChatBubbleOutline,
  MdFileDownload,
  MdFilter,
  MdLink,
  MdMailOutline,
  MdPictureAsPdf,
  MdShare,
  MdLaunch,
  MdRssFeed,
  MdPlayCircleOutline
} from 'react-icons/md'
import {
  FaFacebookF,
  FaFolderOpen,
  FaTwitter,
  FaWhatsapp,
  FaGetPocket,
  FaKey,
  FaEdit,
  FaSpotify,
  FaGoogle,
  FaApple,
  FaNotesMedical
} from 'react-icons/fa'

const ICONS = {
  copyLink: MdLink,
  audio: MdVolumeUp,
  chart: ChartIcon,
  discussion: MdChatBubbleOutline,
  download: MdFileDownload,
  facebook: FaFacebookF,
  dossier: FaFolderOpen,
  link: LinkIcon,
  mail: MdMailOutline,
  markdown: MarkdownIcon,
  share: MdShare,
  shareIOS: ShareIOSIcon,
  twitter: FaTwitter,
  whatsapp: FaWhatsapp,
  pocket: FaGetPocket,
  key: FaKey,
  pdf: MdPictureAsPdf,
  gallery: MdFilter,
  time: TimeIcon,
  video: VideoIcon,
  etiquette: EtiquetteIcon,
  fontSize: FontSizeIcon,
  edit: FaEdit,
  launch: MdLaunch,
  rss: MdRssFeed,
  play: MdPlayCircleOutline,
  spotify: FaSpotify,
  google: FaGoogle,
  apple: FaApple,
  notesMedical: FaNotesMedical
}

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
    display: 'inline-block',
    lineHeight: 0,
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
