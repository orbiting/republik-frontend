import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import { colors, useColorContext } from '@project-r/styleguide'

import ShareIOSIcon from './Icons/ShareIOS'
import FontSizeIcon from './Icons/FontSize'
import MarkdownIcon from './Icons/Markdown'
import EtiquetteIcon from './Icons/Etiquette'
import MdInsertChartOutlined from './Icons/MdInsertChartOutlined'
import MdCollectionsOutlined from './Icons/MdCollectionsOutlined'
import Spotify from './Icons/Spotify'
import Pocket from './Icons/Pocket'

import {
  MdVolumeUp,
  MdChatBubbleOutline,
  MdFileDownload,
  MdLink,
  MdMailOutline,
  MdMail,
  MdPictureAsPdf,
  MdLaunch,
  MdRssFeed,
  MdPlayCircleOutline,
  MdSlideshow,
  MdSchedule,
  MdLanguage,
  MdFolderOpen,
  MdCreate,
  MdVpnKey,
  MdNoteAdd
} from 'react-icons/md'

import {
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoLogoGoogle,
  IoLogoApple
} from 'react-icons/io'

const ICONS = {
  copyLink: MdLink,
  audio: MdVolumeUp,
  chart: MdInsertChartOutlined,
  discussion: MdChatBubbleOutline,
  download: MdFileDownload,
  facebook: IoLogoFacebook,
  dossier: MdFolderOpen,
  link: MdLanguage,
  mail: MdMailOutline,
  mailFilled: MdMail,
  markdown: MarkdownIcon,
  share: ShareIOSIcon,
  shareIOS: ShareIOSIcon,
  twitter: IoLogoTwitter,
  whatsapp: IoLogoWhatsapp,
  pocket: Pocket,
  key: MdVpnKey,
  pdf: MdPictureAsPdf,
  gallery: MdCollectionsOutlined,
  time: MdSchedule,
  video: MdSlideshow,
  etiquette: EtiquetteIcon,
  fontSize: FontSizeIcon,
  edit: MdCreate,
  launch: MdLaunch,
  rss: MdRssFeed,
  play: MdPlayCircleOutline,
  spotify: Spotify,
  google: IoLogoGoogle,
  apple: IoLogoApple,
  notesMedical: MdNoteAdd
}

const DEFAULT_SIZE = 24
const DEFAULT_PADDING = 5

const stackedStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const getExtraStyles = stacked => {
  return css({
    ...(stacked && stackedStyle)
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
    paddingLeft: 4,
    verticalAlign: 'middle'
  }),
  stackedText: css({
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginTop: 5
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
      {...getExtraStyles(stacked)}
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
