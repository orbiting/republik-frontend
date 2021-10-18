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

const ElectionBallot = ({
  candidacies,
  selected,
  mandatory,
  maxVotes,
  onChange,
  showMeta
}) => (
  <div {...styles.table}>
    {candidacies.map(d => (
      <ElectionBallotRow
        key={d.id}
        maxVotes={maxVotes}
        selected={selected.some(c => d.id === c.id)}
        mandatory={mandatory.some(c => d.user.id === c.user.id)}
        onChange={onChange}
        candidate={d}
        disabled={selected.length >= maxVotes}
        showMeta={showMeta}
      />
    ))}
  </div>
)

ElectionBallot.propTypes = {
  candidacies: PropTypes.array,
  selected: PropTypes.array,
  mandatory: PropTypes.array,
  maxVotes: PropTypes.number,
  disabled: PropTypes.bool
}

ElectionBallot.defaultProps = {
  candidacies: [],
  selected: [],
  mandatory: [],
  maxVotes: 1,
  disabled: false,
  showMeta: true
}

export default ElectionBallot
