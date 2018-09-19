export const VOTING_PHASES = {
  INFO: 'INFO',
  VOTE: 'VOTE',
  RESULT: 'RESULT'
}

export const getVotingPhase = (beginDate, endDate) => {
  const now = Date.now()

  if (now < beginDate) {
    return VOTING_PHASES.INFO
  } else if (now > beginDate && now < endDate) {
    return VOTING_PHASES.VOTE
  } else {
    return VOTING_PHASES.RESULT
  }
}
