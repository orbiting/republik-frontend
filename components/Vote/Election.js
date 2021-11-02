import React, { useEffect, useState } from 'react'
import {
  A,
  Button,
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
import ElectionConfirm from './ElectionConfirm'
import { Card, sharedStyles } from './text'

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
        path
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
          birthday
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
    padding: '13px 0'
  }),
  actions: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
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

export const ElectionHeader = ({ children }) => {
  return (
    <div {...styles.header}>
      <P>
        <strong>{children}</strong>
      </P>
    </div>
  )
}

export const ElectionActions = ({ children }) => {
  return (
    <Card style={{ position: 'sticky', bottom: 0, zIndex: 9 }}>
      <div {...styles.actions}>{children}</div>
    </Card>
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
    discussionTag,
    mandatoryCandidates,
    showMeta
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

    let message
    if (election.userHasSubmitted) {
      message = vt('vote/voting/thankyou', {
        submissionDate: messageDateFormat(new Date(election.userSubmitDate))
      })
    } else if (Date.now() > new Date(election.endDate)) {
      message = vt('vote/election/ended')
    } else if (!me) {
      message = vt('vote/election/notSignedIn', {
        beginDate: timeFormat('%d.%m.%Y')(new Date(election.beginDate))
      })
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

    return (
      <div {...styles.wrapper}>
        {isConfirm ? (
          <ElectionConfirm
            election={election}
            vote={vote}
            goBack={e => {
              e?.preventDefault()
              setConfirm(false)
            }}
          />
        ) : (
          <>
            {showHeader && (
              <ElectionHeader>
                {vt('vote/election/votesAvailable', {
                  count: numSeats
                })}
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
                discussionPath={election?.discussion?.path}
                discussionTag={discussionTag}
                disabled={remainingVotes <= 0}
              />
              {electionOpen && (
                <ElectionActions>
                  <div {...sharedStyles.buttons}>
                    <Button primary onClick={() => setConfirm(true)}>
                      {vt('vote/common/continue')}
                    </Button>
                    {isDirty && (
                      <Interaction.P style={{ marginLeft: 30 }}>
                        <A href='#' onClick={reset}>
                          {vt('vote/common/reset')}
                        </A>
                      </Interaction.P>
                    )}
                  </div>
                  <div {...sharedStyles.hint}>
                    {!remainingVotes
                      ? vt('vote/election/noVotesRemaining')
                      : remainingVotes === numSeats
                      ? vt('vote/common/help/blank')
                      : vt('vote/election/votesRemaining', {
                          count: remainingVotes,
                          max: numSeats
                        })}
                  </div>
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
)(({ data, discussionTag, mandatoryCandidates = [], showMeta = true }) => (
  <Loader
    loading={data.loading}
    error={data.error}
    render={() => {
      if (!data?.election?.candidacies?.length) return null
      return (
        <Election
          election={data.election}
          discussionTag={discussionTag}
          mandatoryCandidates={mandatoryCandidates}
          showMeta={showMeta}
        />
      )
    }}
  />
))

export default ElectionLoader
