import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import { IconButton } from '@project-r/styleguide'
import { IoLogoFacebook, IoLogoTwitter, IoLogoWhatsapp } from 'react-icons/io'
import ThreemaLogo from '../Icons/Threema'
import TelegramLogo from '../Icons/Telegram'
import { MdMail, MdLink } from 'react-icons/md'
import withT from '../../lib/withT'
import { trackEvent } from '../../lib/piwik'
import withHeaders, { matchIOSUserAgent } from '../../lib/withHeaders'

import copyToClipboard from 'clipboard-copy'

const ShareButtons = ({
  t,
  url,
  tweet,
  emailSubject,
  emailBody,
  emailAttachUrl,
  eventCategory = 'ShareButtons',
  fill,
  onClose,
  grid,
  headers
}) => {
  const [copyLinkSuffix, setLinkCopySuffix] = useState()
  useEffect(() => {
    if (copyLinkSuffix === 'success') {
      const timeout = setTimeout(() => {
        setLinkCopySuffix()
      }, 5 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [copyLinkSuffix])

  const emailAttache = emailAttachUrl ? `\n\n${url}` : ''

  const shareOptions = [
    {
      name: 'mail',
      href: `mailto:?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody + emailAttache)}`,
      icon: MdMail,
      title: t('article/actionbar/email/title'),
      label: t('article/actionbar/email/label')
    },
    {
      name: 'copyLink',
      href: url,
      icon: MdLink,
      title: t('article/actionbar/link/title'),
      label: t(
        `article/actionbar/link/label${
          copyLinkSuffix ? `/${copyLinkSuffix}` : ''
        }`
      ),
      onClick: e => {
        e.preventDefault()
        copyToClipboard(url)
          .then(() => setLinkCopySuffix('success'))
          .catch(() => setLinkCopySuffix('error'))
      }
    },
    {
      name: 'facebook',
      target: '_blank',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      icon: IoLogoFacebook,
      title: t('article/actionbar/facebook/title'),
      label: t('article/actionbar/facebook/label')
    },
    {
      name: 'twitter',
      target: '_blank',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}&url=${encodeURIComponent(url)}`,
      icon: IoLogoTwitter,
      title: t('article/actionbar/twitter/title'),
      label: t('article/actionbar/twitter/label')
    },
    {
      name: 'whatsapp',
      target: '_blank',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
      icon: IoLogoWhatsapp,
      title: t('article/actionbar/whatsapp/title'),
      label: t('article/actionbar/whatsapp/label')
    },
    {
      name: 'threema',
      target: '_blank',
      href: `https://threema.id/compose?text=${encodeURIComponent(url)}`,
      icon: ThreemaLogo,
      title: t('article/actionbar/threema/title'),
      label: t('article/actionbar/threema/label')
    },
    {
      name: 'telegram',
      target: '_blank',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
      icon: TelegramLogo,
      title: t('article/actionbar/telegram/title'),
      label: t('article/actionbar/telegram/label')
    }
  ].filter(Boolean)

  const isIOS = matchIOSUserAgent(headers.userAgent)
  const isAndroid = headers.userAgent && headers.userAgent.match(/android/i)
  return (
    <div {...styles.buttonGroup} {...(grid && styles.grid)}>
      {shareOptions.map(props => {
        if (props.name === 'threema' && !isIOS && !isAndroid) {
          // only show threema on mobile devices
          return
        }
        return (
          <IconButton
            {...props}
            key={props.title}
            Icon={props.icon}
            label={props.label}
            labelShort={props.label}
            fill={fill}
            onClick={e => {
              trackEvent([eventCategory, props.name, url])
              if (props.onClick) {
                return props.onClick(e)
              }
              onClose && onClose()
            }}
          />
        )
      })}
    </div>
  )
}

const styles = {
  buttonGroup: css({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    '& > a': {
      flex: 'auto',
      marginTop: 15,
      marginBottom: 15,
      flexGrow: 0
    },
    '@media print': {
      display: 'none'
    }
  }),
  grid: css({
    alignItems: 'center',
    justifyContent: 'center'
  })
}

export default withT(withHeaders(ShareButtons))
