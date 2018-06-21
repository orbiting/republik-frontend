import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import IconLink from './IconLink'
import withT from '../lib/withT'

import { colors } from '@project-r/styleguide'

const styles = {
  buttonGroup: css({
    '@media print': {
      display: 'none'
    }
  })
}

const ShareButtons = ({
  t,
  url,
  tweet,
  emailSubject,
  emailBody,
  emailAttachUrl,
  download,
  dossierUrl,
  discussionUrl,
  discussionCount,
  fill,
  onAudioClick,
  onPdfClick,
  pdfUrl,
  inNativeApp
}) => {
  const emailAttache = emailAttachUrl ? `\n\n${url}` : ''
  const shareOptions = [
    !inNativeApp && {
      target: '_blank',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      icon: 'facebook',
      title: t('article/actionbar/facebook')
    },
    !inNativeApp && {
      target: '_blank',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}&url=${encodeURIComponent(url)}`,
      icon: 'twitter',
      title: t('article/actionbar/twitter')
    },
    !inNativeApp && {
      mobileOnly: true,
      target: '_blank',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        url
      )}`,
      icon: 'whatsapp',
      title: t('article/actionbar/whatsapp')
    },
    !inNativeApp && { space: true },
    !inNativeApp && {
      href: `mailto:?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody + emailAttache)}`,
      icon: 'mail',
      title: t('article/actionbar/email')
    },
    dossierUrl && {
      href: dossierUrl,
      icon: 'dossier',
      title: t('article/actionbar/dossier')
    },
    download && {
      target: '_blank',
      download: true,
      href: download,
      icon: 'download',
      title: t('article/actionbar/download')
    },
    !inNativeApp && pdfUrl && {
      icon: 'pdf',
      href: pdfUrl,
      onClick: onPdfClick && (e => {
        if (e.currentTarget.nodeName === 'A' &&
          (e.metaKey || e.ctrlKey || e.shiftKey || (e.nativeEvent && e.nativeEvent.which === 2))) {
          // ignore click for new tab / new window behavior
          return
        }
        e.preventDefault()
        onPdfClick()
      }),
      title: t(`article/actionbar/pdf/${onPdfClick ? 'options' : 'open'}`)
    },
    !inNativeApp && onAudioClick && {
      icon: 'audio',
      href: '#audio',
      onClick: e => {
        e.preventDefault()
        onAudioClick && onAudioClick()
      },
      title: t('article/actionbar/audio')
    }
  ]

  return (
    <span {...styles.buttonGroup}>
      {shareOptions
        .filter(Boolean)
        .map((props, i) => props.space
          ? '\u00a0\u00a0'
          : <IconLink key={props.icon} fill={fill} {...props} />)}
    </span>
  )
}

ShareButtons.propTypes = {
  url: PropTypes.string.isRequired,
  tweet: PropTypes.string.isRequired,
  emailSubject: PropTypes.string.isRequired,
  emailBody: PropTypes.string.isRequired,
  emailAttachUrl: PropTypes.bool.isRequired,
  fill: PropTypes.string
}

ShareButtons.defaultProps = {
  fill: colors.secondary,
  tweet: '',
  emailBody: '',
  emailAttachUrl: true
}

export default withT(ShareButtons)
