export const VOTING_STAGES = {
  INFO: 'INFO',
  VOTE: 'VOTE',
  RESULT: 'RESULT'
}

export const getVotingStage = (beginDate, endDate) => {
  const now = Date.now()

  if (now < beginDate) {
    return VOTING_STAGES.INFO
  } else if (now > beginDate && now < endDate) {
    return VOTING_STAGES.VOTE
  } else {
    return VOTING_STAGES.RESULT
  }
}
