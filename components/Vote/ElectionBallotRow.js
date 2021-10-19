import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  Checkbox,
  fontStyles,
  mediaQueries,
  Radio
} from '@project-r/styleguide'
import { Strong } from './text'
import {
  FavoriteIcon,
  StarsIcon,
  ChevronRightIcon
} from '@project-r/styleguide/icons'
import CandidateCard from './CandidateCard'

const styles = {
  row: css({
    width: '100%',
    marginBottom: 15
  }),
  summary: css({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...fontStyles.sansSerifRegular16,
    lineHeight: 1.3,
    overflowWrap: 'break-word'
  }),
  summaryInfo: css({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& :not(:first-child)': {
      marginLeft: 15
    }
  }),
  summaryDesktop: css({
    [mediaQueries.onlyS]: {
      display: 'none'
    }
  }),
  icon: css({
    ...fontStyles.serifTitle22,
    transition: 'transform 0.3s',
    '& :not(:first-child)': {
      marginLeft: 8
    }
  })
}

const ElectionBallotRow = props => {
  const [expanded, setExpanded] = useState(props.expanded || false)
  const {
    candidate,
    maxVotes,
    selected,
    onChange,
    disabled,
    mandatory,
    showMeta,
    discussionPath
  } = props

  const toggleExpanded = e => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded(expanded => !expanded)
  }

  const SelectionComponent = maxVotes > 1 ? Checkbox : Radio

  const { user: d } = candidate
  const summary = `${
    candidate.yearOfBirth ? `${candidate.yearOfBirth},` : ''
  } ${d.gender ? `${d.gender},` : ''} ${candidate.credential ||
    (d.credentials?.find(c => c.isListed) || {}).description ||
    ''} ${candidate.city ? `aus ${candidate.city}` : ''}`

  const isDisabled = maxVotes > 1 && !selected && disabled

  return (
    <div {...styles.row}>
      <div {...styles.summary}>
        <div {...styles.summaryInfo} onClick={toggleExpanded}>
          <div
            {...styles.icon}
            style={{ transform: expanded && 'rotate(90deg)' }}
          >
            <ChevronRightIcon />
          </div>
          <Strong>{d.name}</Strong>
          <div {...styles.summaryDesktop}>{summary}</div>
        </div>
        {showMeta && (
          <div {...styles.icon}>
            {candidate.recommendation && <StarsIcon />}
            {mandatory && <FavoriteIcon />}
          </div>
        )}
        {onChange && (
          <SelectionComponent
            disabled={isDisabled}
            checked={selected}
            onChange={() => onChange(candidate)}
          />
        )}
      </div>
      {expanded && (
        <CandidateCard
          candidate={candidate}
          summary={summary}
          discussionPath={discussionPath}
        />
      )}
    </div>
  )
}

ElectionBallotRow.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  maxVotes: PropTypes.number,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  candidate: PropTypes.object.isRequired,
  showMeta: PropTypes.bool,
  discussionPath: PropTypes.string
}

ElectionBallotRow.defaultProps = {
  selected: false,
  disabled: false,
  maxVotes: 1,
  expanded: false,
  showMeta: true
}

export default ElectionBallotRow
