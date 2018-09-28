import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import ChevronDownIcon from 'react-icons/lib/md/expand-more'

import { fontStyles, mediaQueries } from '@project-r/styleguide'
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
  })
}

class Collapsible extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: true
    }

    this.toggleCollapsed = () => {
      this.setState(({collapsed}) => ({
        collapsed: !collapsed
      }))
    }
  }

  render () {
    const {label, children, vt} = this.props
    const { collapsed } = this.state

    return (
      <div {...styles.wrapper}>
        <div {...styles.toggle} onClick={this.toggleCollapsed}>
          { collapsed
            ? <div {...styles.toggleIcon}><ChevronRightIcon /></div>
            : <div {...styles.toggleIcon}><ChevronDownIcon /></div>
          }
          {
            label || vt('common/moreInfo')
          }
        </div>
        { collapsed ||
          <div>
            {
              children
            }
          </div>
        }
      </div>
    )
  }
}

Collapsible.propTypes = {
  label: PropTypes.string
}

export default voteT(Collapsible)
