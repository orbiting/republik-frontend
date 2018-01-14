import React from 'react'

import Link from '../Link/Href'

import { styles as iconLinkStyles } from '../IconLink'
import Icon from '../Icons/Discussion'

import {
  colors
} from '@project-r/styleguide'

const IconLink = ({ path }) => {
  return <Link href={path} passHref>
    <a {...iconLinkStyles.link}>
      <Icon size={24} fill={colors.primary} />
    </a>
  </Link>
}

export default IconLink
