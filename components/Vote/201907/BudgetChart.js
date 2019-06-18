import React, { Component } from 'react'
import { colors, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { Tiny } from '../text'
import BudgetChartItem from './BudgetChartItem'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import voteT from '../voteT'

const styles = {
  wrapper: css({
    width: '100%',
    maxWidth: '420px',
    margin: '25px auto',
    position: 'relative',
    minHeight: 200
  }),
  actions: css({
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBg
  })
}

class BudgetChart extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      height: 0
    }

    this.measure = () => {
      const headerHeight = window.innerWidth < mediaQueries.mBreakPoint
        ? HEADER_HEIGHT_MOBILE
        : HEADER_HEIGHT

      const height = Math.min(
        window.innerHeight - headerHeight - 50,
        this.props.maxHeight - headerHeight)
      if (height) {
        this.setState({ height })
      }
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.measure)
    this.measure()
  }

  render () {
    const { data, total, displayAmount, maxHeight } = this.props
    const { height } = this.state

    return (
      <div {...styles.wrapper}>
        <BudgetChartItem
          color={colors.text}
          label={'Gesamt'}
          amount={displayAmount(total)}
        />
        {data.map(({ key, label, amount, color, more }) => (
          <BudgetChartItem
            key={key}
            label={label}
            amount={displayAmount(amount)}
            background={color}
            height={amount / total * (height || maxHeight)}
          >
            <Tiny dangerousHTML={more} indent={false} />
          </BudgetChartItem>
        ))}
      </div>
    )
  }
}

BudgetChart.propTypes = {
  data: PropTypes.array,
  total: PropTypes.number,
  displayAmount: PropTypes.func,
  maxHeight: PropTypes.number
}

BudgetChart.defaultProps = {
  maxHeight: 500
}

export default compose(
  voteT
)(BudgetChart)
