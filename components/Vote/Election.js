import React, { useEffect, useState } from 'react'
import {
  A,
  Button,
  colors,
  fontFamilies,
  Interaction,
  mediaQueries,
  RawHtml,
  useColorContext
} from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { css } from 'glamor'
import ElectionBallot from './ElectionBallot'
import voteT from './voteT'
import withMe from '../../lib/apollo/withMe'
import { timeFormat } from '../../lib/utils/format'
import Loader from '../Loader'
import AddressEditor, { withAddressData } from './AddressEditor'
import { IncumbentIcon } from './ElectionBallotRow'
import ElectionConfirm from './ElectionConfirm'

const { P } = Interaction

const query = gql`
  query getElection($slug: String!) {
    election(slug: $slug) {
      id
      userIsEligible
      userHasSubmitted
      userSubmitDate
      description
      beginDate
      endDate
      numSeats
      discussion {
        id
        comments {
          id
          totalCount
        }
      }
      candidacies {
        id
        isIncumbent
        yearOfBirth
        city
        recommendation
        comment {
          id
        }
        election {
          slug
          discussion {
            id
          }
        }
        user {
          id
          name
          username
          publicUrl
          twitterHandle
          facebookId
          statement
          portrait
          disclosures
          gender
          biographyContent
          credentials {
            isListed
            description
          }
        }
        postalCodeGeo {
          countryName
          countryCode
          postalCode
          lat
          lon
        }
      }
    }
  }
`

const messageDateFormat = timeFormat('%e. %B %Y')

const styles = {
  wrapper: css({
    width: '100%',
    position: 'relative',
    minHeight: 200
  }),
  header: css({
    position: 'sticky',
    padding: '20px 0',
    top: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    zIndex: 10,
    [mediaQueries.onlyS]: {
      flexDirection: 'column-reverse',
      textAlign: 'center',
      margin: '0 0px',
      marginTop: 5,
      '& strong': {
        fontFamily: fontFamilies.sansSerifMedium,
        fontWeight: 'normal'
      }
    }
  }),
  actions: css({
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBg
  }),
  link: css({
    marginTop: 10
  }),
  message: css({
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    padding: 30,
    textAlign: 'center'
  })
}

const sortNames = (c1, c2) => {
  let name1 = c1.user.name.toUpperCase()
  let name2 = c2.user.name.toUpperCase()
  if (name1 < name2) {
    return -1
  }
  if (name1 > name2) {
    return 1
  }
  return 0
}

export const ElectionHeader = ({ children }) => (
  <div {...styles.header}>{children}</div>
)

export const ElectionActions = ({ children }) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.actions} {...colorScheme.set('backgroundColor', 'alert')}>
      {children}
    </div>
  )
}

const ElectionMessage = ({ message }) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.wrapper} style={{ marginBottom: 30 }}>
      <div {...styles.message} {...colorScheme.set('backgroundColor', 'alert')}>
        <RawHtml
          type={P}
          dangerouslySetInnerHTML={{
            __html: message
          }}
        />
      </div>
    </div>
  )
}

const Election = compose(
  voteT,
  withMe,
  withAddressData
)(
  ({
    election,
    vt,
    addressData,
    me,
    mandatoryCandidates,
    showMeta,
    discussionPath
  }) => {
    const [vote, setVote] = useState(
      [...election.candidacies]
        .sort((c1, c2) => {
          if (
            (c1.recommendation && !c2.recommendation) ||
            (c1.isIncumbent && !c2.isIncumbent)
          ) {
            return -1
          } else if (
            (c2.recommendation && !c1.recommendation) ||
            (c2.isIncumbent && !c1.isIncumbent)
          ) {
            return 1
          } else return sortNames(c1, c2)
        })
        .map(candidate => ({ candidate, selected: false }))
    )
    const [isDirty, setDirty] = useState(false)
    const [isConfirm, setConfirm] = useState(false)

    useEffect(() => {
      setDirty(!!vote.some(item => item.selected))
    }, [vote])

    const toggleCandidate = candidate => {
      const allowMultiple = election.numSeats > 1
      setVote(
        vote.map(item =>
          item.candidate.id === candidate.id
            ? { ...item, selected: !item.selected }
            : allowMultiple
            ? item
            : { ...item, selected: false }
        )
      )
    }

    const reset = event => {
      event.preventDefault()
      setVote(vote.map(item => ({ ...item, selected: false })))
      setConfirm(false)
    }

    const hasEnded = Date.now() > new Date(election.endDate)

    let message
    if (election.userHasSubmitted) {
      message = vt('vote/election/thankyou', {
        submissionDate: messageDateFormat(new Date(election.userSubmitDate))
      })
    } else if (hasEnded) {
      message = vt('vote/election/ended')
    } else if (!me) {
      message = vt('vote/election/notSignedIn')
    } else if (!election.userIsEligible) {
      message = vt('vote/election/notEligible')
    }

    if (election.userIsEligible && !addressData.voteMe?.address) {
      return <AddressEditor />
    }

    const { numSeats } = election
    const givenVotes = vote.filter(item => item.selected).length
    const remainingVotes = numSeats - givenVotes

    const electionOpen = !message
    const showHeader = electionOpen && numSeats > 1
    const hasIncumbent = vote.some(item => item.candidate.isIncumbent)

    return (
      <div {...styles.wrapper}>
        {isConfirm ? (
          <ElectionConfirm
            election={election}
            vote={vote}
            goBack={e => {
              e.preventDefault()
              setConfirm(false)
            }}
          />
        ) : (
          <>
            {showHeader && (
              <ElectionHeader>
                <P>
                  <strong>
                    {remainingVotes
                      ? vt('vote/election/votesRemaining', {
                          count: remainingVotes,
                          max: numSeats
                        })
                      : vt('vote/election/noVotesRemaining')}
                  </strong>
                </P>
                {hasIncumbent && (
                  <small>
                    <IncumbentIcon width={10} />
                    {vt('vote/election/legendIncumbent')}
                  </small>
                )}
              </ElectionHeader>
            )}
            {message && <ElectionMessage message={message} />}
            <div {...styles.wrapper}>
              <ElectionBallot
                vote={vote}
                onChange={electionOpen ? toggleCandidate : undefined}
                maxVotes={election.numSeats}
                mandatory={mandatoryCandidates}
                showMeta={showMeta}
                discussionPath={discussionPath}
                disabled={remainingVotes <= 0}
              />
              {electionOpen && (
                <ElectionActions>
                  <Button primary onClick={() => setConfirm(true)}>
                    {vt('vote/election/labelVote')}
                  </Button>
                  {isDirty ? (
                    <A href='#' {...styles.link} onClick={reset}>
                      {vt('vote/election/labelReset')}
                    </A>
                  ) : (
                    <div {...styles.link}>{vt('vote/election/help')}</div>
                  )}
                </ElectionActions>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
)

const ElectionLoader = compose(
  graphql(query, {
    options: ({ slug }) => ({
      variables: {
        slug
      }
    })
  })
)(({ data, discussionPath, mandatoryCandidates = [], showMeta = true }) => {
  return (
    <Loader
      loading={data.loading}
      error={data.error}
      render={() => {
        if (!data?.election?.candidacies?.length) return null
        return (
          <Election
            election={data.election}
            mandatoryCandidates={mandatoryCandidates}
            showMeta={showMeta}
            discussionPath={discussionPath}
          />
        )
      }}
    />
  )
})

export default ElectionLoader
