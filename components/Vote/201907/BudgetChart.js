import React, { Component, Fragment } from 'react'
import { colors, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { Tiny } from '../text'
import BudgetChartItem from './BudgetChartItem'
import BudgetTable from './BudgetTable'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import voteT, { vt } from '../voteT'

import { formatLocale } from 'd3-format'

const nbspNumbers = formatLocale({
  decimal: ',',
  thousands: '\u202F',
  grouping: [3],
  currency: ['CHF\u00a0', '']
})
const countFormat = nbspNumbers.format(',.1f')

export const displayAmount = amount => vt('vote/201907/budget/amount', {
  amount: countFormat(amount / 1000000)
})

const styles = {
  wrapper: css({
    width: '100%',
    margin: '0 auto',
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
        window.innerHeight - headerHeight - 120,
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
    const { vt, data, total, maxHeight } = this.props
    const { height } = this.state

    if (!data || !data.children) {
      return null
    }

    return (
      <div {...styles.wrapper}>
        <BudgetChartItem
          color={colors.text}
          category={'Gesamt'}
          amount={displayAmount(total)}
        />
        {data.children && data.children.map(({ data }) => (
          <BudgetChartItem
            key={data.key}
            category={data.category}
            amount={displayAmount(data.amount)}
            background={data.color}
            height={data.amount / total * (height || maxHeight)}
            table={data.children}
          >
            <Tiny dangerousHTML={data.more} indent={false} />
            {data.children && (
              <Fragment>
                <BudgetTable
                  data={data.children}
                  total={data.amount}
                  pk={data.pk}
                  sk={data.sk}
                  fraction={data.fraction}
                />
                <Tiny dangerousHTML={vt('vote/201907/budget/table/caption')} indent={false} note />
              </Fragment>
            )}
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
  maxHeight: 700
}

export default compose(
  voteT
)(BudgetChart)
