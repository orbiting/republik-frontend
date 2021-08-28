import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import {
  A,
  Checkbox,
  colors,
  DEFAULT_PROFILE_PICTURE,
  fontStyles,
  mediaQueries,
  Radio,
  useColorContext
} from '@project-r/styleguide'
import { Strong } from './text'
import {
  FavoriteIcon,
  StarsIcon,
  ChevronRightIcon,
  ExpandMoreIcon
} from '@project-r/styleguide/icons'
import voteT from './voteT'
import withInNativeApp from '../../lib/withInNativeApp'
import withT from '../../lib/withT'
import Link from 'next/link'

const MISSING_VALUE = <span>…</span>

const styles = {
  row: css({
    position: 'relative',
    width: '100%',
    marginRight: 0
  }),
  statement: css({
    [mediaQueries.onlyS]: {
      marginBottom: 10,
      ...fontStyles.serifTitle22
    },
    ...fontStyles.serifTitle26
  }),
  summaryWrapper: css({
    padding: '13px 20px 15px 20px',
    marginTop: 8,
    marginBottom: 8,
    // marginLeft: -26,
    marginRight: 0
  }),
  summary: css({
    width: '100%',
    display: 'flex',
    ...fontStyles.sansSerifRegular16,
    lineHeight: 1.3,
    overflowWrap: 'break-word',
    '& div:nth-child(1)': {
      width: '30%'
    },
    '& div:nth-child(2)': {
      width: '10%'
    },
    '& div:nth-child(3)': {
      width: '35%',
      paddingRight: 10
    },
    '& div:nth-child(4)': {
      width: '15%',
      paddingRight: 15
    },
    '& div:nth-child(5)': {
      width: '10%'
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
      marginBottom: 25,
      width: '100%',
      lineHeight: 1.4,
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
    marginTop: 10,
    marginBottom: 5,
    [mediaQueries.lUp]: {
      marginTop: 5
    }
  }),
  portrait: css({
    display: 'block',
    backgroundColor: '#E2E8E6',
    width: 104,
    height: 104,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'grayscale(1)',
    marginRight: 15
  }),
  profile: css({
    marginTop: 5,
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
  profileFooter: css({
    marginTop: 8,
    paddingBottom: 5
  }),
  moreInfo: css({
    marginTop: 15
  }),
  wrapper: css({
    [mediaQueries.mUp]: {
      minHeight: 45
    },
    width: '100%',
    display: 'flex',
    padding: 0
  }),
  wrapperSelected: css({}),
  icon: css({
    marginTop: 0,
    width: 26,
    marginLeft: -6,
    padding: 0,
    [mediaQueries.onlyS]: {
      marginTop: 0
    }
  }),
  selection: css({
    width: 14,
    paddingTop: 3,
    marginRight: 5
  })
}

const ElectionBallotRow = props => {
  const [expanded, setExpanded] = useState(props.expanded || false)
  const [colorScheme] = useColorContext()

  const toggleExpanded = () => {
    setExpanded(expanded => !expanded)
  }

  const {
    candidate,
    maxVotes,
    selected,
    onChange,
    disabled,
    interactive,
    mandatory,
    vt,
    t,
    showMeta,
    inNativeApp,
    profile
  } = props
  const SelectionComponent = maxVotes > 1 ? Checkbox : Radio

  const { user: d } = candidate

  const summary = (
    <Fragment>
      <div>
        {candidate.yearOfBirth} {d.gender?.slice(0, 1).toUpperCase()}
      </div>
      <div>
        {candidate.credential ||
          (d.credentials?.find(c => c.isListed) || {}).description ||
          MISSING_VALUE}
      </div>
      <div>{candidate.city}</div>
    </Fragment>
  )

  const target = inNativeApp || profile ? undefined : '_blank'

  return (
    <div {...styles.wrapper} {...(expanded && styles.wrapperSelected)}>
      <div
        onClick={e => {
          e.preventDefault()
          interactive && toggleExpanded(d.id)
        }}
      >
        {expanded ? (
          <div {...styles.icon}>
            <ExpandMoreIcon />
          </div>
        ) : (
          <div {...styles.icon}>
            <ChevronRightIcon />
          </div>
        )}
      </div>
      <div {...styles.row}>
        <div
          {...styles.summary}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
          onClick={onChange ? () => onChange(candidate) : undefined}
        >
          <div>
            {interactive ? (
              <A
                href='#'
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleExpanded(d.id)
                }}
              >
                {d.name}
              </A>
            ) : (
              d.name
            )}
          </div>
          {summary}
          {showMeta && (
            <div>
              <div style={{ width: 36, height: 18 }}>
                {candidate.recommendation && <StarsIcon size={18} />}
                {mandatory && <FavoriteIcon size={18} />}
              </div>
            </div>
          )}
        </div>
        {expanded && (
          <div
            {...styles.summaryWrapper}
            {...colorScheme.set('backgroundColor', 'alert')}
          >
            <div {...styles.summaryMobile}>{summary}</div>
            <div {...styles.details}>
              <div {...styles.profile}>
                <div>
                  <div
                    style={{
                      backgroundImage: `url(${d.portrait ||
                        DEFAULT_PROFILE_PICTURE})`
                    }}
                    {...styles.portrait}
                  />
                  <div>
                    {!profile && (
                      <div {...styles.profileFooter}>
                        <A href={`/~${d.username || d.id}`} target={target}>
                          Profil
                        </A>
                      </div>
                    )}
                    {candidate.comment && candidate.comment.id && (
                      <div>
                        <Link
                          href={{
                            pathname: '/vote/genossenschaft/diskutieren',
                            query: {
                              discussion: candidate.election.slug,
                              focus: candidate.comment.id
                            }
                          }}
                          passHref
                        >
                          <A target={target}>
                            {vt('vote/election/discussion')}
                          </A>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div {...styles.statement}>{d.statement || MISSING_VALUE}</div>
              </div>
              {d.disclosures && (
                <div {...styles.moreInfo}>
                  <Strong>{t('profile/disclosures/label')}:</Strong>{' '}
                  {d.disclosures}
                </div>
              )}
              {candidate.recommendation && (
                <div {...styles.moreInfo}>
                  <Strong>{vt('vote/election/recommendation')}</Strong>{' '}
                  {candidate.recommendation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {maxVotes > 0 && onChange && (
        <div {...styles.selection}>
          <SelectionComponent
            disabled={maxVotes > 1 && !selected && disabled}
            checked={selected}
            onChange={() => onChange(candidate)}
          />
        </div>
      )}
    </div>
  )
}

ElectionBallotRow.propTypes = {
  profile: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  maxVotes: PropTypes.number,
  expanded: PropTypes.bool,
  interactive: PropTypes.bool,
  onChange: PropTypes.func,
  candidate: PropTypes.object.isRequired,
  showMeta: PropTypes.bool
}

ElectionBallotRow.defaultProps = {
  selected: false,
  disabled: false,
  maxVotes: 1,
  expanded: false,
  interactive: true,
  showMeta: true
}

export default compose(withInNativeApp, voteT, withT)(ElectionBallotRow)
