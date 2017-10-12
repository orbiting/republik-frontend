import React from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'

import { linkRule } from '@project-r/styleguide'

import DownloadIcon from 'react-icons/lib/md/file-download'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import LinkIcon from 'react-icons/lib/md/link'
import MailIcon from 'react-icons/lib/md/mail-outline'
import PersonIcon from 'react-icons/lib/md/person'
import PersonOutlineIcon from 'react-icons/lib/md/person-outline'
import ShareIcon from 'react-icons/lib/md/share'
import StarIcon from 'react-icons/lib/md/star'
import StarBorderIcon from 'react-icons/lib/md/star-border'
import TwitterIcon from 'react-icons/lib/fa/twitter'

const DEFAULT_SIZE = 24
const DEFAULT_PADDING = 5

const styles = {
  link: {
    textDecoration: 'none',
    verticalAlign: 'middle',
    ':hover > span:first-child': {
      opacity: 0.6
    },
    ':first-child': {
      paddingLeft: 0
    },
    ':last-child': {
      paddingRight: 0
    }
  },
  icon: css({
    ':hover': {
      opacity: 0.6
    }
  })
}

const ICONS = {
  download: DownloadIcon,
  facebook: FacebookIcon,
  link: LinkIcon,
  mail: MailIcon,
  author: PersonIcon,
  freelancer: PersonOutlineIcon,
  share: ShareIcon,
  crowdfunder: StarBorderIcon,
  patron: StarIcon,
  twitter: TwitterIcon
}

const IconLink = ({ href, target, fill, icon, size, text, padding }) => {
  const Icon = ICONS[icon]
  return (
    <a
      href={href}
      {...merge(styles.link, {
        padding: `${padding !== undefined ? padding : DEFAULT_PADDING}px`
      })}
      target={target}
    >
      <span {...styles.icon}>
        <Icon fill={fill} size={size || DEFAULT_SIZE} />
      </span>
      {text && <span {...(href ? linkRule : {})}>&nbsp;{text}</span>}
    </a>
  )
}

IconLink.propTypes = {
  icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired
}

export default IconLink
