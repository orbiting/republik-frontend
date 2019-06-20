import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import sharedStyles from '../../sharedStyles'
import ExpandMoreIcon from 'react-icons/lib/md/expand-more'
import ExpandLessIcon from 'react-icons/lib/md/expand-less'

import { fontStyles, mediaQueries } from '@project-r/styleguide'
import voteT from '../voteT'

const styles = {
  wrapper: css({
    marginTop: 0,
    marginBottom: 0,
    position: 'relative'
  }),
  label: css({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0 15px'
  }),
  toggle: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16
    },
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased'
  }),
  toggleIcon: css({
    padding: 0,
    width: 24,
    marginLeft: 0,
    display: 'inline-block',
    opacity: 0.5
  }),
  toggleContent: css({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '25px',
    cursor: 'pointer',
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16
    }
  }),
  toggleIconContent: css({
    padding: 0,
    color: '#000',
    width: 24,
    marginLeft: 0,
    display: 'inline-block',
    position: 'absolute',
    bottom: 5,
    left: `calc(50% - ${24 / 2}px)`,
    opacity: 0.5
  }),
  content: css({
    borderWidth: '0 3px 3px 3px',
    borderStyle: 'solid',
    position: 'relative',
    padding: '10px 15px 30px 15px'
  })
}

class BudgetChartItem extends React.Component {
  constructor (props) {
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

  render () {
    const { children, category, height, background, color, amount } = this.props
    const { collapsed } = this.state

    const hasMore = !!children
    const ExpandIcon = collapsed ? ExpandMoreIcon : ExpandLessIcon
    const iconTitle = collapsed ? 'Mehr' : 'Schliessen'

    const compact = !!height && height < 35
    const minHeight = compact ? 25 : 35

    return (
      <Fragment>
        <div {...styles.wrapper} style={{
          // height: collapsed ? Math.max(height || 0, minHeight) : minHeight,
          background,
          borderBottom: collapsed ? '1px solid #fff' : undefined
        }}>
          <div {...styles.toggle}
            onClick={hasMore ? this.toggleCollapsed : undefined}
            style={{
              color,
              height: Math.max(height || 0, minHeight),
              cursor: hasMore ? 'pointer' : undefined
            }}>
            {hasMore && (
              <span {...styles.label}>
                {category}
                <button
                  {...sharedStyles.plainButton}
                  {...styles.toggleIcon}
                  title={iconTitle}>
                  <ExpandIcon size={24} fill={'#fff'} />
                </button>
              </span>
            )}
            {!hasMore && (
              <span {...styles.label}>
                {category}
              </span>
            )}
            {amount && (
              <span {...styles.label}>{amount}</span>
            )}
          </div>
        </div>
        {collapsed ||
          <div {...styles.content} style={{
            borderColor: background
            // minHeight: `calc(${height}px - ${minHeight}px)`
          }}>
            {children}
            <div {...styles.toggleContent} onClick={this.toggleCollapsed}>
              <button
                {...sharedStyles.plainButton}
                {...styles.toggleIconContent}
                title={iconTitle}>
                <ExpandIcon size={24} />
              </button>
            </div>
          </div>
        }
      </Fragment>
    )
  }
}

BudgetChartItem.propTypes = {
  label: PropTypes.string
}

BudgetChartItem.defaultProps = {
  color: '#fff'
}

export default voteT(BudgetChartItem)
