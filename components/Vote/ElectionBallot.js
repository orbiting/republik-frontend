import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { Checkbox, Radio } from '@project-r/styleguide'
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
    const changeComponent = maxVotes > 1 ? Checkbox : Radio

    return (
      <div {...styles.table}>
        { candidates
          .map(d =>
            <ElectionBallotRow
              key={d.id}
              selected={selected.some(id => d.id === id)}
              changeComponent={changeComponent}
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
