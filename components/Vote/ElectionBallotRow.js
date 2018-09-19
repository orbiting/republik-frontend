import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { A, fontStyles, mediaQueries, colors } from '@project-r/styleguide'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import ChevronDownIcon from 'react-icons/lib/md/expand-more'

const styles = {
  row: css({
    position: 'relative',
    width: '100%',
    marginRight: 20
  }),
  statement: css({
    [mediaQueries.onlyS]: {
      ...fontStyles.serifBold19
    },
    ...fontStyles.serifBold24
  }),
  summaryWrapper: css({
  }),
  summary: css({
    width: '100%',
    minHeight: 20,
    display: 'flex',
    [mediaQueries.onlyS]: {
      '& :nth-child(1)': {
        width: '60%'
      },
      '& :nth-child(4)': {
        width: '40%',
        textAlign: 'right'
      },
      '& :nth-child(2), :nth-child(3)': {
        display: 'none'
      }
    },
    '& :nth-child(1)': {
      width: '30%'
    },
    '& :nth-child(3)': {
      width: '30%'
    },
    '& :nth-child(2), :nth-child(4)': {
      width: '20%'
    }
  }),
  summaryMobile: css({
    width: '100%',
    minHeight: 20,
    display: 'none',
    [mediaQueries.onlyS]: {
      display: 'flex',
      '& :nth-child(1)': {
        width: '60%'
      }

    }
  }),
  summaryLinks: css({
    width: '100%',
    minHeight: 20,
    display: 'flex',
    borderTop: '1px solid black',
    '& :nth-child(1)': {
      width: '60%'
    }
  }),
  details: css({
    width: '100%',
    margin: '15px 0',
    '& > *': {
      margin: 3
    },
    '& img': {
      width: 90,
      marginRight: 8,
      float: 'left'
    }
  }),
  wrapper: css({
    width: '100%',
    display: 'flex',
    padding: 5
  }),
  wrapperSelected: css({
    background: colors.secondaryBg
  })
}

class ElectionBallotRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: props.expanded || false
    }
    this.toggleExpanded = () => {
      this.setState(({expanded}) => ({
        expanded: !expanded
      }))
    }
  }

  render () {
    const { candidate, changeComponent, selected, onChange, disabled } = this.props
    const { expanded } = this.state
    const SelectionComponent = changeComponent

    const { user: d } = candidate

    return (
      <div {...styles.wrapper} {...(expanded && styles.wrapperSelected)}>
        <div
          onClick={e => { e.preventDefault(); this.toggleExpanded(d.id) }}
        >
          {
            expanded
              ? <ChevronDownIcon />
              : <ChevronRightIcon />
          }
        </div>
        <div
          {...styles.row}
        >
          <div {...styles.summary} onClick={e => { e.preventDefault(); this.toggleExpanded(d.id) }}>
            <div>
              <A>{`${d.firstName} ${d.lastName}`}</A>
            </div>
            <div>
              { candidate.yearOfBirth }
            </div>
            <div>
              { (d.credentials.find(c => c.isListed) || {}).description }
            </div>
            <div>
              { candidate.city }
            </div>
          </div>
          { expanded &&
            <div {...styles.summaryWrapper}>
              <div {...styles.summaryMobile}>
                <div>
                  { candidate.yearOfBirth }
                </div>
                <div>
                  {d.credentials && d.credentials.length > 0 &&
                  d.credentials.length[0] &&
                  d.credentials.length[0].description}
                </div>
              </div>
              <div {...styles.details}>
                <div>
                  <img src={d.portrait} />
                  <div {...styles.statement}>
                    {d.statement}
                  </div>
                </div>
                <div style={{ clear: 'both' }}>
                  <div>
                    <A href={`/~${d.id}`}>Profil</A>
                  </div>
                  { candidate.commentId &&
                    <div>
                      <A href={`/~${d.id}`}>Debatte</A>
                    </div>
                  }
                </div>
                { candidate.recommendation &&
                  <div>
                    {
                      `Die Republik sagt: ${candidate.recommendation}`
                    }

                  </div>
                }
              </div>
            </div>
          }
        </div>
        { changeComponent && onChange &&
          <div style={{width: 18}}>
            <SelectionComponent
              disabled={!selected && disabled}
              checked={selected}
              onChange={() => onChange(candidate.id)}
            />
          </div>
        }
      </div>
    )
  }
}

ElectionBallotRow.defaultProps = {
  selected: false,
  disabled: false,
  changeComponent: null,
  onChange: () => {}
}

ElectionBallotRow.propTypes = {
  selected: PropTypes.bool,
  changeComponent: PropTypes.element,
  disabled: PropTypes.bool,
  candidate: PropTypes.object,
  onChange: PropTypes.func
}

export default ElectionBallotRow
