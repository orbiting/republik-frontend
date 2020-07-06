import React, { useState, useEffect } from 'react'

import { css } from 'glamor'

import IconLink from '../IconLink'

import withT from '../../lib/withT'
import { trackEvent } from '../../lib/piwik'

import withHeaders, { matchIOSUserAgent } from '../../lib/withHeaders'

import { fontStyles } from '@project-r/styleguide'

import copyToClipboard from 'clipboard-copy'
import { shouldIgnoreClick } from '../Link/utils'

const styles = {
  buttonGroup: css({
    display: 'flex',
    flexWrap: 'wrap',
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
  buttonGroupLeft: css({
    justifyContent: 'flex-start'
  }),
  buttonGroupCenter: css({
    justifyContent: 'center'
  })
}

const PodcastButtons = ({
  t,
  podigeeSlug,
  appleUrl,
  googleUrl,
  spotifyUrl,
  eventCategory = 'PodcastButtons',
  audioSource,
  onAudioClick,
  headers,
  center
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

  if (!podigeeSlug) {
    return
  }

  const mainFeed = `https://${podigeeSlug}.podigee.io/feed/mp3`

  const isIOS = matchIOSUserAgent(headers.userAgent)
  const isAndroid = headers.userAgent && headers.userAgent.match(/android/i)

  const plattformWithApp = isIOS
    ? 'ios'
    : headers.userAgent && headers.userAgent.match(/Mac OS X 10_15/)
    ? 'catalina'
    : isAndroid
    ? 'android'
    : null

  const canPlay = !!(audioSource && onAudioClick)

  const copyMinWidth = 105
  const shareOptions = [
    canPlay && {
      animate: true,
      href: audioSource.mp3,
      icon: 'play',
      title: t('PodcastButtons/play'),
      label: t('PodcastButtons/play'),
      // label: audioSource.durationMs
      // ? getFormattedTime(audioSource.durationMs / 1000)
      // : t('PodcastButtons/play'),
      onClick: e => {
        if (shouldIgnoreClick(e)) {
          return
        }
        e.preventDefault()
        onAudioClick()
      }
    },
    plattformWithApp && {
      href:
        plattformWithApp === 'android' || plattformWithApp === 'chrome'
          ? `pcast:${podigeeSlug}.podigee.io/feed/mp3`
          : `podcast://${podigeeSlug}.podigee.io/feed/aac`,
      icon: 'launch',
      label: t('PodcastButtons/app')
    },
    spotifyUrl && {
      href: spotifyUrl,
      target: '_blank',
      icon: 'spotify',
      label: t('PodcastButtons/spotify')
    },
    appleUrl &&
      !isAndroid && {
        href: appleUrl,
        target: '_blank',
        icon: 'apple',
        label: t('PodcastButtons/apple')
      },
    googleUrl &&
      !isIOS && {
        href: googleUrl,
        target: '_blank',
        icon: 'google',
        label: t('PodcastButtons/google')
      },
    {
      href: `https://${podigeeSlug}.podigee.io/feed/mp3`,
      target: '_blank',
      icon: 'rss',
      label: t('PodcastButtons/rss')
    },
    {
      href: mainFeed,
      icon: 'copyLink',
      title: t('PodcastButtons/copy'),
      label: t(
        `PodcastButtons/copy${copyLinkSuffix ? `/${copyLinkSuffix}` : ''}`
      ),
      onClick: e => {
        e.preventDefault()
        copyToClipboard(mainFeed)
          .then(() => setLinkCopySuffix('success'))
          .catch(() => setLinkCopySuffix('error'))
      },
      style: {
        minWidth: copyMinWidth
      }
    }
  ].filter(Boolean)

  return (
    <>
      <h3
        style={{
          textAlign: center ? 'center' : 'left',
          marginBottom: 0,
          ...fontStyles.sansSerifMedium16
        }}
      >
        {t(`PodcastButtons/title${canPlay ? '/play' : ''}`)}
      </h3>
      <div
        {...styles.buttonGroup}
        {...(center ? styles.buttonGroupCenter : styles.buttonGroupLeft)}
      >
        {shareOptions.map(props => (
          <IconLink
            key={props.icon}
            size={32}
            stacked
            {...props}
            onClick={e => {
              trackEvent([
                eventCategory,
                [plattformWithApp, props.icon].filter(Boolean).join(' '),
                podigeeSlug
              ])
              if (props.onClick) {
                return props.onClick(e)
              }
            }}
            style={{
              ...(center
                ? {
                    marginLeft: 10,
                    marginRight: 10,
                    minWidth: copyMinWidth
                  }
                : {
                    marginRight: 20
                  }),
              ...props.style
            }}
          >
            {props.label}
          </IconLink>
        ))}
      </div>
    </>
  )
}

export default withT(withHeaders(PodcastButtons))
