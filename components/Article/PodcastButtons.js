import React, { useState, useEffect } from 'react'

import { css } from 'glamor'

import IconLink from '../IconLink'

import withT from '../../lib/withT'
import track from '../../lib/piwik'

import withHeaders, { matchIOSUserAgent } from '../../lib/withHeaders'

import { fontStyles } from '@project-r/styleguide'

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

const PodcastButtons = ({
  t,
  podigeeSlug,
  eventCategory = 'PodcastButtons',
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

  const mainFeed = `https://${podigeeSlug}.podigee.io/feed/mp3`

  const plattformWithApp = matchIOSUserAgent(headers.userAgent)
    ? 'ios'
    : headers.userAgent && headers.userAgent.match(/Mac OS X 10_15/)
    ? 'catalina'
    : headers.userAgent && headers.userAgent.match(/android/i)
    ? 'android'
    : headers.userAgent && headers.userAgent.match(/Chrome/)
    ? 'chrome'
    : null

  const shareOptions = [
    plattformWithApp && {
      href:
        plattformWithApp === 'android' || plattformWithApp === 'chrome'
          ? `pcast:${podigeeSlug}.podigee.io/feed/mp3`
          : `podcast://${podigeeSlug}.podigee.io/feed/aac`,
      icon: 'launch',
      label: t('PodcastButtons/app')
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
        minWidth: 105
      }
    }
  ].filter(Boolean)

  return (
    <div style={{ marginBottom: 20, marginTop: 20 }}>
      <h3 style={{ marginBottom: 10, ...fontStyles.sansSerifMedium16 }}>
        {t('PodcastButtons/title')}
      </h3>
      <div {...styles.buttonGroup}>
        {shareOptions.map(props => (
          <IconLink
            key={props.icon}
            size={32}
            stacked
            {...props}
            onClick={e => {
              track([
                'trackEvent',
                eventCategory,
                [plattformWithApp, props.icon].filter(Boolean).join(' '),
                podigeeSlug
              ])
              if (props.onClick) {
                return props.onClick(e)
              }
            }}
            style={{
              marginRight: 20,
              ...props.style
            }}
          >
            {props.label}
          </IconLink>
        ))}
      </div>
    </div>
  )
}

export default withT(withHeaders(PodcastButtons))
