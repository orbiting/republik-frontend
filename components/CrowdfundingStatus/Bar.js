import React, { Component } from 'react'
import { css, merge } from 'glamor'

import { colors, fontFamilies, RawHtml } from '@project-r/styleguide'

const BAR_COLOR = '#333333'
const HEIGHT = 8

const styles = {
  bar: css({
    height: 8,
    marginTop: -20,
    marginBottom: 20,
    backgroundColor: BAR_COLOR,
    position: 'relative'
  }),
  barInner: css({
    backgroundColor: colors.primary,
    height: '100%'
  }),
  goal: css({
    position: 'absolute',
    top: 0,
    left: 0,
    height: HEIGHT,
    backgroundColor: 'transparent',
    boxSizing: 'content-box',
    borderRight: `2px solid ${BAR_COLOR}`
  }),
  currentGoal: css({
    borderRight: 'none'
  }),
  lowerGoal: css({
    borderRight: '2px solid #fff'
  }),
  goalNumber: css({
    color: colors.secondary,
    fontFamiliy: fontFamilies.sansSerifMedium,
    fontSize: 14,
    lineHeight: '14px',
    borderRight: `1px solid ${colors.secondary}`,
    textAlign: 'right',
    paddingTop: 12,
    paddingRight: 4
  }),
  goalBar: css({
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.secondary,
    height: 8
  }),
  box: css({
    position: 'absolute',
    top: 40,
    left: 5,
    right: 5,
    backgroundColor: colors.secondary,
    color: '#fff',
    fontFamiliy: fontFamilies.sansSerifMedium,
    fontSize: 14,
    lineHeight: '19px',
    padding: '12px 17px'
  }),
  arrow: css({
    position: 'absolute',
    top: 32,
    right: 15,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '0 4px 8px 4px',
    borderColor: `transparent transparent ${colors.secondary} transparent`
  }),
  noInteraction: css({
    pointerEvents: 'none'
  })
}

const widthForGoal = (goal, status, accessor) => {
  return (
    Math.ceil(Math.min(1, status[accessor] / goal[accessor]) * 1000000) /
      10000 +
    '%'
  )
}

class GoalBar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  render() {
    const { status, goals, accessor, format, showLast } = this.props
    const goal = goals[goals.length - 1]

    const uniqueGoals = goals
      .filter((d, i) => i === goals.findIndex(g => g[accessor] === d[accessor]))
      .reverse()

    const hover = this.state.hover || (showLast && uniqueGoals[0])

    return (
      <div {...styles.bar} style={{ zIndex: hover ? 1 : 0 }}>
        <div
          {...styles.barInner}
          style={{
            width: widthForGoal(goal, status, accessor)
          }}
        />
        {uniqueGoals.length > 1 &&
          uniqueGoals.map((uniqueGoal, i) => (
            <div
              key={i}
              {...merge(
                styles.goal,
                i === 0 && styles.currentGoal,
                i > 0 && status[accessor] < goal[accessor] && styles.lowerGoal
              )}
              style={{
                width: widthForGoal(goal, uniqueGoal, accessor)
              }}
              onTouchStart={e => {
                e.preventDefault()
                this.setState({
                  hover: uniqueGoal
                })
              }}
              onTouchEnd={() =>
                this.setState({
                  hover: undefined
                })
              }
              onMouseOver={() =>
                this.setState({
                  hover: uniqueGoal
                })
              }
              onMouseOut={() =>
                this.setState({
                  hover: undefined
                })
              }
            >
              {uniqueGoal === hover && (
                <div {...styles.noInteraction}>
                  <div
                    {...styles.goalBar}
                    style={{
                      width: widthForGoal(uniqueGoal, status, accessor)
                    }}
                  />
                  <div {...styles.goalNumber}>
                    {format(uniqueGoal[accessor])}
                  </div>
                  {!!hover.description && <div {...styles.arrow} />}
                </div>
              )}
            </div>
          ))}
        {!!hover && !!hover.description && (
          <div {...styles.box}>
            <RawHtml
              dangerouslySetInnerHTML={{
                __html: hover.description
              }}
            />
          </div>
        )}
      </div>
    )
  }
}

GoalBar.defaultProps = {
  format: value => value
}

export default GoalBar
