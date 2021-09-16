import React, { useState } from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'
import { css } from 'glamor'
import Link from 'next/link'

import {
  A,
  Checkbox,
  DEFAULT_PROFILE_PICTURE,
  fontStyles,
  mediaQueries,
  Radio,
  useColorContext,
  renderCommentMdast
} from '@project-r/styleguide'
import { Strong } from './text'
import {
  FavoriteIcon,
  StarsIcon,
  ChevronRightIcon
} from '@project-r/styleguide/icons'
import voteT from './voteT'
import withInNativeApp from '../../lib/withInNativeApp'
import withT from '../../lib/withT'
import Contact from '../Profile/Contact'

const styles = {
  row: css({
    width: '100%',
    marginBottom: 15
  }),
  statement: css({
    [mediaQueries.onlyS]: {
      ...fontStyles.serifTitle22
    },
    ...fontStyles.serifTitle26
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
    '& :not(:first-child)': {
      marginLeft: 15
    }
  }),
  summaryDesktop: css({
    [mediaQueries.onlyS]: {
      display: 'none'
    }
  }),
  summaryMobile: css({
    display: 'none',
    [mediaQueries.onlyS]: {
      marginBottom: 15,
      display: 'block'
    }
  }),
  detail: css({
    display: 'flex',
    padding: 15,
    margin: '8px 0',
    [mediaQueries.onlyS]: {
      flexDirection: 'column'
    }
  }),
  profile: css({
    display: 'flex',
    paddingRight: 15,
    flexDirection: 'column',
    alignItems: 'start',
    '& img': {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'grayscale(1)'
    },
    [mediaQueries.onlyS]: {
      flexDirection: 'row',
      marginBottom: 15
    }
  }),
  portrait: css({
    display: 'block',
    backgroundColor: '#E2E8E6',
    width: 100,
    height: 100,
    minWidth: 100,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'grayscale(1)'
  }),
  moreInfo: css({
    marginTop: 15
  }),
  icon: css({
    ...fontStyles.serifTitle22,
    transition: 'transform 0.3s',
    '& :not(:first-child)': {
      marginLeft: 8
    }
  }),
  externalLinks: css({
    display: 'flex'
  }),
  shortInfo: css({
    [mediaQueries.onlyS]: {
      paddingLeft: 15
    }
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

  const summary = `${
    candidate.yearOfBirth ? `${candidate.yearOfBirth},` : ''
  } ${d.gender ? `${d.gender},` : ''} ${candidate.credential ||
    (d.credentials?.find(c => c.isListed) || {}).description ||
    ''} ${candidate.city ? `aus ${candidate.city}` : ''}`

  const target = inNativeApp || profile ? undefined : '_blank'
  return (
    <div {...styles.row}>
      <div
        {...styles.summary}
        style={{ cursor: onChange ? 'pointer' : 'default' }}
        onClick={onChange ? () => onChange(candidate) : undefined}
      >
        <div {...styles.summaryInfo}>
          <div
            {...styles.icon}
            style={{ transform: expanded && 'rotate(90deg)' }}
            onClick={e => {
              e.preventDefault()
              interactive && toggleExpanded(d.id)
            }}
          >
            <ChevronRightIcon />
          </div>
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
          <div {...styles.summaryDesktop}>{summary}</div>
        </div>
        {showMeta && (
          <div {...styles.icon}>
            {candidate.recommendation && <StarsIcon />}
            {mandatory && <FavoriteIcon />}
          </div>
        )}
        {maxVotes > 0 && onChange && (
          <>
            <SelectionComponent
              disabled={maxVotes > 1 && !selected && disabled}
              checked={selected}
              onChange={() => onChange(candidate)}
            />
          </>
        )}
      </div>
      {expanded && (
        <div
          {...styles.detail}
          {...colorScheme.set('backgroundColor', 'alert')}
        >
          <div {...styles.profile}>
            <div
              style={{
                backgroundImage: `url(${d.portrait || DEFAULT_PROFILE_PICTURE})`
              }}
              {...styles.portrait}
            />
            <div {...styles.shortInfo}>
              <div {...styles.summaryMobile}>{summary}</div>

              {!profile && d.username && (
                <>
                  <Contact user={d} electionBallot />
                  <div style={{ marginTop: 8 }}>
                    <Link href={`/~${d.username}`} passHref>
                      <A target={target}>Profil</A>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <div {...styles.statement}>{d.statement || 'Ihr Statement'}</div>
            <div {...styles.biography}>
              {d.biographyContent && renderCommentMdast(d.biographyContent)}
            </div>
            <div>
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
                    <A target={target}>{vt('vote/election/discussion')}</A>
                  </Link>
                </div>
              )}
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
