import React, { useState } from 'react'

import { css } from 'glamor'

import IconLink from '../IconLink'

import withT from '../../lib/withT'
import track from '../../lib/piwik'

import { copyToClipboard } from './utils'

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
  copyText: css({
    textOverflow: 'initial',
    display: 'inline-block',
    whiteSpace: 'initial',
    textAlign: 'center',
    minWidth: 100
  })
}

const ShareButtons = ({
  t,
  url,
  tweet,
  emailSubject,
  emailBody,
  emailAttachUrl,
  fill,
  onClose,
  grid
}) => {
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
    }
  ]

  const copyLink = {
    href: url,
    icon: 'copyLink',
    title: t('article/actionbar/link/title'),
    label: {
      init: t('article/actionbar/link/label'),
      success: t('article/actionbar/link/label/success'),
      error: t('article/actionbar/link/label/error')
    }
  }

  const copyLinkStatuses = {
    init: 'init',
    success: 'success',
    error: 'error'
  }

  const [linkCopyStatus, setLinkCopyStatus] = useState(copyLinkStatuses.init)

  return (
    <div {...styles.buttonGroup}>
      {shareOptions.map((props, i) => (
        <IconLink
          key={props.icon}
          fill={fill}
          size={32}
          style={grid ? {
            padding: 0,
            width: '33%'
          } : {
            marginRight: 20
          }}
          onClick={() => {
            track([
              'trackEvent',
              'ShareOverlay',
              props.icon,
              url
            ])
            onClose && onClose()
          }}
          stacked
          {...props}
        >
          {props.label}
        </IconLink>
      ))}
      <IconLink
        key={copyLink.icon}
        fill={fill}
        size={32}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          track([
            'trackEvent',
            'ShareOverlay',
            copyLink.icon,
            url
          ])
          if (copyToClipboard(url)) {
            setLinkCopyStatus(copyLinkStatuses.success)
            setTimeout(
              () => {
                setLinkCopyStatus(copyLinkStatuses.init)
              },
              5 * 1000
            )
          } else {
            setLinkCopyStatus(copyLinkStatuses.error)
          }
        }}
        stacked
        {...copyLink}
      >
        <span {...styles.copyText}>
          {copyLink.label[linkCopyStatus]}
        </span>
      </IconLink>
    </div>
  )
}

export default withT(ShareButtons)
