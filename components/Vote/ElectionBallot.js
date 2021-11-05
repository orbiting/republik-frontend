import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import ElectionBallotRow from './ElectionBallotRow'

const styles = {
  table: css({
    width: '100%'
  })
}

const ElectionBallot = ({
  vote,
  mandatory,
  maxVotes,
  onChange,
  showMeta,
  disabled,
  discussionPath,
  discussionTag
}) => (
  <div {...styles.table}>
    {vote.map(({ candidate, selected }, i) => (
      <ElectionBallotRow
        key={candidate.id}
        odd={i % 2}
        candidate={candidate}
        selected={selected}
        maxVotes={maxVotes}
        mandatory={mandatory.some(c => candidate.user.id === c.user.id)}
        onChange={onChange}
        disabled={disabled}
        showMeta={showMeta}
        discussionPath={discussionPath}
        discussionTag={discussionTag}
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
  discussionPath: PropTypes.string,
  discussionTag: PropTypes.string
}

ElectionBallot.defaultProps = {
  vote: [],
  mandatory: [],
  maxVotes: 1,
  showMeta: true
}

export default ElectionBallot
