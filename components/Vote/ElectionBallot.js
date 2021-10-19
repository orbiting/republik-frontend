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
  vote,
  mandatory,
  maxVotes,
  onChange,
  showMeta,
  disabled,
  discussionUrl
}) => (
  <div {...styles.table}>
    {vote.map(({ candidate, selected }) => (
      <ElectionBallotRow
        key={candidate.id}
        candidate={candidate}
        selected={selected}
        maxVotes={maxVotes}
        mandatory={mandatory.some(c => candidate.user.id === c.user.id)}
        onChange={onChange}
        disabled={disabled}
        showMeta={showMeta}
        discussionUrl={discussionUrl}
      />
    ))}
  </div>
)

ElectionBallot.propTypes = {
  vote: PropTypes.array,
  mandatory: PropTypes.array,
  maxVotes: PropTypes.number,
  onChange: PropTypes.func,
  showMeta: PropTypes.bool,
  disabled: PropTypes.bool,
  discussionUrl: PropTypes.string
}

ElectionBallot.defaultProps = {
  vote: [],
  mandatory: [],
  maxVotes: 1,
  showMeta: true
}

export default ElectionBallot
