import React, { Component, Fragment } from 'react'
import { css } from 'glamor'

import Link from '../Link/Href'

import { styles as iconLinkStyles } from '../IconLink'
import Icon from '../Icons/Discussion'

import { focusSelector } from '../../lib/utils/scroll'

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
    const { path, discussionPage, discussionId, count, style, small } = this.props
    const size = small ? 20 : 24
    const fontSize = small ? '15px' : undefined

    const content = <Fragment>
      <Icon size={size} fill={colors.primary} />
      {count > 0 && (
        <span {...iconLinkStyles.text} {...styles.text} style={{ fontSize }}>
          &nbsp;{count}
        </span>
      )}
    </Fragment>

    if (discussionPage) {
      return <a href='#' onClick={(e) => {
        e.preventDefault()
        focusSelector(`[data-discussion-id='${discussionId}']`)
      }} {...iconLinkStyles.link} {...styles.a} style={style}>
        {content}
      </a>
    }

    return <Link href={path} passHref>
      <a {...iconLinkStyles.link} {...styles.a} style={style}>
        {content}
      </a>
    </Link>
  }
}

export default withCount(IconLink)
