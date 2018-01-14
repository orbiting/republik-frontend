import React, { Component } from 'react'
import {css} from 'glamor'

import Link from '../Link/Href'

import { styles as iconLinkStyles } from '../IconLink'
import Icon from '../Icons/Discussion'

import { withCount } from './enhancers'

import {
  colors, fontStyles
} from '@project-r/styleguide'

const styles = {
  a: css({
    marginLeft: 20,
    '@media print': {
      display: 'none'
    }
  }),
  text: css({
    paddingLeft: 3,
    color: colors.primary,
    ...fontStyles.sansSerifMedium16
  })
}

class IconLink extends Component {
  componentDidMount () {
    this.unsubscribe = this.props.subscribe()
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  render () {
    const { path, count } = this.props
    return <Link href={path} passHref>
      <a {...iconLinkStyles.link} {...styles.a}>
        <Icon size={24} fill={colors.primary} />
        {count > 0 && (
          <span {...iconLinkStyles.text} {...styles.text}>
            &nbsp;{count}
          </span>
        )}
      </a>
    </Link>
  }
}

export default withCount(IconLink)
