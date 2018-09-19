import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import ElectionBallotRow from './ElectionBallotRow'

const styles = {
  table: css({
    width: '100%',
    cursor: 'pointer'
  })
}

class ElectionBallot extends React.Component {
  render () {
    const { candidates, selected, maxVotes, onChange } = this.props

    return (
      <div {...styles.table}>
        { candidates
          .map(d =>
            <ElectionBallotRow
              key={d.id}
              maxVotes={maxVotes}
              selected={selected.some(id => d.id === id)}
              onChange={onChange}
              candidate={d}
              disabled={selected.length >= maxVotes}
            />
          )
        }
      </div>
    )
  }
}

ElectionBallot.propTypes = {
  candidates: PropTypes.array,
  selected: PropTypes.array,
  maxVotes: PropTypes.bool,
  disabled: PropTypes.bool
}

ElectionBallot.defaultProps = {
  candidates: [],
  selected: [],
  maxVotes: 1,
  disabled: false
}

export default ElectionBallot
