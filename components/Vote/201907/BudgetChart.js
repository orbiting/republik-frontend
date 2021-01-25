import React, { Component, Fragment } from 'react'
import { mediaQueries } from '@project-r/styleguide'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { Tiny, Small } from '../text'
import BudgetChartItem from './BudgetChartItem'
import BudgetTable from './BudgetTable'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../../constants'
import voteT, { vt } from '../voteT'
import { swissNumbers } from '../../../lib/utils/format'

const countFormat = swissNumbers.format(',.2f')

export const displayAmount = amount =>
  vt('vote/201907/budget/amount', {
    amount: countFormat(amount / 1000000)
  })

const styles = {
  wrapper: css({
    width: '100%',
    margin: '10px auto',
    position: 'relative'
  })
}

class BudgetChart extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      height: props.maxHeight
    }

    this.measure = () => {
      const headerHeight =
        window.innerWidth < mediaQueries.mBreakPoint
          ? HEADER_HEIGHT_MOBILE
          : HEADER_HEIGHT

      const height = Math.max(
        this.props.minHeight,
        Math.min(
          window.innerHeight - headerHeight - 4 * headerHeight,
          this.props.maxHeight - headerHeight
        )
      )
      if (height) {
        this.setState({ height })
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.measure)
    this.measure()
  }

  render() {
    const { vt, data, total, maxHeight } = this.props
    const { height } = this.state

    if (!data || !data.children) {
      return null
    }
    const numBlocks = data.children.length

    return (
      <div {...styles.wrapper}>
        <BudgetChartItem
          category={vt('vote/201907/budget/total')}
          total={displayAmount(total)}
          highlight
        />
        {data.children &&
          data.children.map(({ data }, i) => (
            <BudgetChartItem
              key={`item-${i}`}
              category={data.category}
              total={displayAmount(data.total)}
              background={data.background}
              height={(data.total / total) * (height || maxHeight)}
              last={i === numBlocks - 1}
            >
              <Small dangerousHTML={data.more} indent={false} />
              {data.children && (
                <Fragment>
                  <BudgetTable {...data} data={data.children} />
                  <Tiny
                    dangerousHTML={vt('vote/201907/budget/table/caption')}
                    indent={false}
                    note
                  />
                </Fragment>
              )}
            </BudgetChartItem>
          ))}
      </div>
    )
  }
}

BudgetChart.propTypes = {
  data: PropTypes.object,
  total: PropTypes.number,
  displayAmount: PropTypes.func,
  maxHeight: PropTypes.number
}

BudgetChart.defaultProps = {
  minHeight: 400,
  maxHeight: 700
}

export default voteT(BudgetChart)
