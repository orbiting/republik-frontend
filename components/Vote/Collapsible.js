import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { MdChevronRight, MdExpandMore } from 'react-icons/md'

import {
  fontFamilies,
  fontStyles,
  mediaQueries,
  colors,
  Interaction
} from '@project-r/styleguide'
import voteT from './voteT'

const styles = {
  wrapper: css({
    marginTop: 15,
    marginBottom: 20
  }),
  toggle: css({
    cursor: 'pointer',
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16
    }
  }),
  toggleIcon: css({
    width: 26,
    marginLeft: -6,
    display: 'inline-block'
  }),
  text: css(Interaction.fontRule, {
    marginTop: 10,
    marginLeft: 20,
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16,
      lineHeight: 1.4
    },
    '& a': {
      textDecoration: 'none',
      color: colors.primary,
      ':visited': {
        color: colors.primary
      },
      '@media (hover)': {
        ':hover': {
          color: colors.secondary
        }
      }
    }
  })
}

class Collapsible extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true
    }

    this.toggleCollapsed = () => {
      this.setState(({ collapsed }) => ({
        collapsed: !collapsed
      }))
    }
  }

  render() {
    const { label, children, vt } = this.props
    const { collapsed } = this.state

    return (
      <div {...styles.wrapper}>
        <div {...styles.toggle} onClick={this.toggleCollapsed}>
          {collapsed ? (
            <div {...styles.toggleIcon}>
              <MdChevronRight />
            </div>
          ) : (
            <div {...styles.toggleIcon}>
              <MdExpandMore />
            </div>
          )}
          {label || vt('common/moreInfo')}
        </div>
        {collapsed || <div {...styles.text}>{children}</div>}
      </div>
    )
  }
}

Collapsible.propTypes = {
  label: PropTypes.string
}

export default voteT(Collapsible)
