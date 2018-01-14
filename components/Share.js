import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import IconLink from './IconLink'

import { colors } from '@project-r/styleguide'

const styles = {
  buttonGroup: css({
    '@media print': {
      display: 'none'
    }
  })
}

const ShareButtons = ({
  url,
  tweet,
  emailSubject,
  emailBody,
  emailAttachUrl,
  download,
  dossierUrl,
  discussionUrl,
  discussionCount,
  fill
}) => {
  const emailAttache = emailAttachUrl ? `\n\n${url}` : ''
  const shareOptions = [
    {
      target: '_blank',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      icon: 'facebook'
    },
    {
      target: '_blank',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet
      )}&url=${encodeURIComponent(url)}`,
      icon: 'twitter'
    },
    {
      mobileOnly: true,
      target: '_blank',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        url
      )}`,
      icon: 'whatsapp'
    },
    {
      href: `mailto:?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody + emailAttache)}`,
      icon: 'mail'
    },
    dossierUrl && {
      href: dossierUrl,
      icon: 'dossier'
    },
    download && {
      target: '_blank',
      download: true,
      href: download,
      icon: 'download'
    }
  ]

  return (
    <span {...styles.buttonGroup}>
      {shareOptions
        .filter(Boolean)
        .map((props, i) => <IconLink key={i} fill={fill} {...props} />)}
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

export default ShareButtons
