import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { A, Checkbox, colors, DEFAULT_PROFILE_PICTURE, fontStyles, mediaQueries, Radio } from '@project-r/styleguide'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'
import ChevronDownIcon from 'react-icons/lib/md/expand-more'
import { Strong } from './text'
import FavoriteIcon from 'react-icons/lib/md/favorite'
import StarsIcon from 'react-icons/lib/md/stars'

const MISSING_VALUE = <span>…</span>

const styles = {
  row: css({
    position: 'relative',
    width: '100%',
    marginRight: 20
  }),
  statement: css({
    [mediaQueries.onlyS]: {
      marginBottom: 15,
      ...fontStyles.serifTitle22
    },
    ...fontStyles.serifTitle26
  }),
  summaryWrapper: css({
  }),
  summary: css({
    width: '100%',
    display: 'flex',
    ...fontStyles.sansSerifRegular16,
    lineHeight: 1.3,
    '& div:nth-child(1)': {
      width: '30%'
    },
    '& div:nth-child(2)': {
      width: '10%'
    },
    '& div:nth-child(3)': {
      width: '35%'
    },
    '& div:nth-child(4)': {
      width: '20%',
      paddingRight: 5
    },
    '& div:nth-child(5)': {
      width: '5%'
    },
    [mediaQueries.onlyS]: {
      '& div:nth-child(1)': {
        width: '80%'
      },
      '& div:nth-child(2), & div:nth-child(3), & div:nth-child(4)': {
        display: 'none'
      },
      '& div:last-child': {
        width: '20%'
      }
    }
  }),
  summaryMobile: css({
    display: 'none',
    [mediaQueries.onlyS]: {
      width: '100%',
      lineHeight: 1.4,
      marginTop: 5,
      display: 'block'
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
    margin: '15px 0'
  }),
  portrait: css({
    display: 'block',
    backgroundColor: '#E2E8E6',
    width: 104,
    height: 104,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'grayscale(1)',
    marginRight: 8
  }),
  profile: css({
    display: 'flex',
    alignItems: 'start',
    [mediaQueries.onlyS]: {
      flexDirection: 'column-reverse'
    },
    '& img': {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'grayscale(1)'
    }
  }),
  recommendation: css({
    marginTop: 15
  }),
  wrapper: css({
    width: '100%',
    display: 'flex',
    padding: 5

  }),
  wrapperSelected: css({
    background: colors.secondaryBg
  }),
  icon: css({
    marginTop: -3,
    padding: 2,
    [mediaQueries.onlyS]: {
      marginTop: 0
    }
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
    const {candidate, maxVotes, selected, onChange, disabled, interactive, mandatory} = this.props
    const { expanded } = this.state
    const SelectionComponent = maxVotes > 1 ? Checkbox : Radio

    const { user: d } = candidate

    const summary =
      <Fragment>
        <div>
          { candidate.yearOfBirth || MISSING_VALUE }
        </div>
        <div>
          { (d.credentials.find(c => c.isListed) || {}).description || MISSING_VALUE }
        </div>
        <div>
          { candidate.city || MISSING_VALUE }
        </div>
      </Fragment>

    return (
      <div {...styles.wrapper} {...(expanded && styles.wrapperSelected)}>
        <div
          onClick={e => { e.preventDefault(); interactive && this.toggleExpanded(d.id) }}
        >
          {
            expanded
              ? <div {...styles.icon}><ChevronDownIcon /></div>
              : <div {...styles.icon}><ChevronRightIcon /></div>
          }
        </div>
        <div
          {...styles.row}
        >
          <div
            {...styles.summary}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={e => { e.preventDefault(); interactive && this.toggleExpanded(d.id) }}
          >
            <div>
              {interactive
                ? <A>{d.name}</A>
                : d.name
              }

            </div>
            {
              summary
            }
            <div>
              <div style={{width: 36, height: 18}}>
                {candidate.recommendation &&
                <StarsIcon size={18} color={colors.lightText} />
                }
                {mandatory &&
                <FavoriteIcon size={18} color={colors.lightText} />
                }
              </div>
            </div>
          </div>
          { expanded &&
            <div {...styles.summaryWrapper}>
              <div {...styles.summaryMobile}>
                { summary }
              </div>
              <div {...styles.details}>
                <div {...styles.profile}>
                  <div>
                    <div style={{backgroundImage: `url(${d.portrait || DEFAULT_PROFILE_PICTURE})`}} {...styles.portrait} />
                    <div>
                      <div>
                        <A href={`/~${d.id}`}>Profil</A>
                      </div>
                      {candidate.commentId &&
                      <div>
                        <A href={`/~${d.id}`}>Debatte</A>
                      </div>
                      }
                    </div>
                  </div>
                  <div {...styles.statement}>
                    {d.statement || MISSING_VALUE}
                  </div>
                </div>
                { candidate.recommendation &&
                  <div {...styles.recommendation}>
                    <Strong>Wahlempfehlung der Republik:</Strong> {candidate.recommendation}
                  </div>
                }
              </div>
            </div>
          }
        </div>
        { maxVotes > 0 && onChange &&
          <div style={{width: 18}}>
            <SelectionComponent
              disabled={maxVotes > 1 && !selected && disabled}
              checked={selected}
              onChange={() => onChange(candidate)}
            />
          </div>
        }
      </div>
    )
  }
}

ElectionBallotRow.defaultProps = {
  selected: false,
  mandatory: false,
  disabled: false,
  maxVotes: 1,
  expanded: false,
  interactive: true,
  onChange: () => {}
}

ElectionBallotRow.propTypes = {
  selected: PropTypes.bool,
  mandatory: PropTypes.bool,
  disabled: PropTypes.bool,
  maxVotes: PropTypes.number,
  expanded: PropTypes.bool,
  interactive: PropTypes.bool,
  onChange: PropTypes.func,
  candidate: PropTypes.object.isRequired
}

export default ElectionBallotRow
