import React, { useState, useEffect } from 'react'

import { css } from 'glamor'

import IconLink from '../IconLink'

import withT from '../../lib/withT'
import { trackEvent } from '../../lib/piwik'

import copyToClipboard from 'clipboard-copy'

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
  })
}

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
  pocket = false
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
      target: '_blank',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      icon: 'facebook',
      title: t('article/actionbar/facebook/title'),
      label: t('article/actionbar/facebook/label')
    },
    {
      target: '_blank',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}&url=${encodeURIComponent(url)}`,
      icon: 'twitter',
      title: t('article/actionbar/twitter/title'),
      label: t('article/actionbar/twitter/label')
    },
    {
      target: '_blank',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
      icon: 'whatsapp',
      title: t('article/actionbar/whatsapp/title'),
      label: t('article/actionbar/whatsapp/label')
    },
    {
      href: `mailto:?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody + emailAttache)}`,
      icon: 'mail',
      title: t('article/actionbar/email/title'),
      label: t('article/actionbar/email/label')
    },
    pocket && {
      target: '_blank',
      href: `https://getpocket.com/save?url=${encodeURIComponent(url)}`,
      icon: 'pocket',
      title: t('article/actionbar/pocket/title'),
      label: t('article/actionbar/pocket/label')
    },
    {
      href: url,
      icon: 'copyLink',
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
      },
      style: {
        minWidth: 105
      }
    }
  ].filter(Boolean)

  return (
    <div {...styles.buttonGroup}>
      {shareOptions.map(props => (
        <IconLink
          key={props.icon}
          fill={fill}
          size={32}
          stacked
          {...props}
          onClick={e => {
            trackEvent([eventCategory, props.icon, url])
            if (props.onClick) {
              return props.onClick(e)
            }
            onClose && onClose()
          }}
          style={
            grid
              ? {
                  padding: 0,
                  width: '33%',
                  ...props.style
                }
              : {
                  marginRight: 20,
                  ...props.style
                }
          }
        >
          {props.label}
        </IconLink>
      ))}
    </div>
  )
}

export default withT(ShareButtons)
