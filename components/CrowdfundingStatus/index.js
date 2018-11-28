import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ascending } from 'd3-array'
import { timeMinute } from 'd3-time'

import withT from '../../lib/withT'
import { chfFormat, countFormat } from '../../lib/utils/format'

import {
  STATUS_POLL_INTERVAL_MS
} from '../../lib/constants'

import {
  P, Label, fontFamilies
} from '@project-r/styleguide'

import Bar from './Bar'

const styles = {
  primaryNumber: css({
    display: 'block',
    marginBottom: -10,
    fontSize: 80,
    fontFamily: fontFamilies.sansSerifRegular,
    lineHeight: 1
  }),
  secondaryNumber: css({
    display: 'block',
    marginBottom: -5,
    fontSize: 43,
    fontFamily: fontFamilies.sansSerifRegular,
    lineHeight: 1
  }),
  smallNumber: css({
    display: 'block',
    marginBottom: -5,
    fontSize: 22,
    fontFamily: fontFamilies.sansSerifRegular,
    lineHeight: 1
  }),
  hoverGoal: css({
    cursor: 'default',
    fontFamily: fontFamilies.sansSerifMedium
  })
}

class Status extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }
  tick () {
    const now = new Date()

    const msLeft = 1000 - now.getMilliseconds() + 50
    let msToNextTick = (60 - now.getSeconds()) * 1000 + msLeft

    const endDate = this.props.endDate || this.props.crowdfunding.endDate
    if (endDate) {
      const end = new Date(endDate)
      if (end < now) {
        return
      }
      const totalMinutes = timeMinute.count(now, end)
      const hours = Math.floor(totalMinutes / 60) % 24
      if (hours === 0) {
        msToNextTick = msLeft
      }
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(
      () => {
        this.setState({
          now: new Date()
        })
        this.tick()
      },
      msToNextTick
    )
  }
  componentDidMount () {
    if (!this.props.compact) {
      this.tick()
    }
  }
  componentWillUnmount () {
    clearTimeout(this.timeout)
  }
  render () {
    if (!this.props.crowdfunding) {
      return null
    }

    const endDate = this.props.endDate || this.props.crowdfunding.endDate
    const {
      crowdfundingName,
      crowdfunding: { goals, status },
      t,
      money, people, memberships
    } = this.props
    const now = new Date()
    const nextMinute = timeMinute.ceil(new Date())

    // end date is expected to be an exact minute
    // timeMinute.round is used to ensure that and
    // support end dates like '2017-05-31 19:59:59.999+02'
    const end = timeMinute.round(new Date(endDate))

    const totalMinutes = timeMinute.count(nextMinute, end)
    const minutes = totalMinutes % 60
    const hours = Math.floor(totalMinutes / 60) % 24
    const days = Math.floor(totalMinutes / 60 / 24)

    if (!goals.length) {
      return null
    }

    const goalsByPeople = [].concat(goals)
      .sort((a, b) => ascending(a.people, b.people))
    const goal = goalsByPeople[goalsByPeople.length - 1]

    const createHoverGoalCount = (format, value) => (
      <a key='count' {...styles.hoverGoal}
        onTouchStart={(e) => {
          e.preventDefault()
          this.setState({
            showGoal: true
          })
        }}
        onTouchEnd={() => this.setState({
          showGoal: false
        })}
        onMouseOver={() => this.setState({
          showGoal: true
        })}
        onMouseOut={() => this.setState({
          showGoal: false
        })}>
        {format(value)}
      </a>
    )

    if (this.props.compact) {
      return (
        <div style={{ paddingTop: 10 }}>
          <P>
            <span {...styles.smallNumber}>{countFormat(status.people)}</span>
            <Label>{t.elements('crowdfunding/status/goal/people', {
              count: createHoverGoalCount(countFormat, goal.people)
            })}</Label>
          </P>
          <Bar goals={goalsByPeople}
            showLast={this.state.showGoal}
            status={status}
            accessor='people'
            format={countFormat} />
        </div>
      )
    }

    return (
      <Fragment>
        {[
          people && {
            accessor: 'people',
            format: countFormat
          },
          memberships && {
            accessor: 'memberships',
            format: countFormat
          },
          money && {
            accessor: 'money',
            format: (value) => chfFormat(value / 100)
          }
        ].filter(Boolean).map(({ accessor, goalAccessor, format }, i) => (
          <Fragment key={accessor}>
            <P>
              <span {...styles[i === 0 ? 'primaryNumber' : 'secondaryNumber']}>{countFormat(status.people)}</span>
              <Label>{t.first.elements([
                `crowdfunding/status/goal/${crowdfundingName}/${accessor}`,
                `crowdfunding/status/goal/${accessor}`
              ], {
                count: createHoverGoalCount(format, goal[goalAccessor || accessor])
              })}</Label>
            </P>
            <Bar goals={goalsByPeople}
              showLast={this.state.showGoal}
              status={status}
              accessor={accessor}
              format={format} />
          </Fragment>
        ))}
        <P>
          <span {...styles.smallNumber}>
            {minutes >= 0 ? (
              [
                days > 0 && t.pluralize(
                  'crowdfunding/status/time/days',
                  {
                    count: days
                  }
                ),
                (days !== 0 || hours > 0) && t.pluralize(
                  'crowdfunding/status/time/hours',
                  {
                    count: hours
                  }
                ),
                t.pluralize(
                  'crowdfunding/status/time/minutes',
                  {
                    count: minutes
                  }
                ),
                days === 0 && hours === 0 && this.state.now && t.pluralize(
                  'crowdfunding/status/time/seconds',
                  {
                    count: 60 - now.getSeconds()
                  }
                )
              ].filter(Boolean).join(' ')
            ) : (
              t.first([
                `crowdfunding/status/time/ended/${crowdfundingName}`,
                'crowdfunding/status/time/ended'
              ])
            )}
          </span>
          <Label>{t('crowdfunding/status/time/label')}</Label>
        </P>
      </Fragment>
    )
  }
}

export const RawStatus = Status

RawStatus.propTypes = {
  people: PropTypes.bool,
  memberships: PropTypes.bool,
  money: PropTypes.bool
}

const query = gql`
query crowdfundingStatus($crowdfundingName: String!) {
  crowdfunding(name: $crowdfundingName) {
    id
    name
    goals {
      people
      money
      memberships
      description
    }
    status {
      people
      money
      memberships
    }
    endDate
    hasEnded
  }
}
`

export const withStatus = Component => graphql(query, {
  options: {
    pollInterval: +STATUS_POLL_INTERVAL_MS
  },
  props: ({ data }) => {
    return {
      crowdfunding: data.crowdfunding,
      statusRefetch: data.refetch,
      statusStartPolling: data.startPolling,
      statusStopPolling: data.stopPolling
    }
  }
})(Component)

export default compose(
  withStatus,
  withT
)(Status)
