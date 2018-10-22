export const VOTING_STAGES = {
  INFO: 'INFO',
  VOTE: 'VOTE',
  RESULT: 'RESULT'
}

export const getVotingStage = (beginDate, endDate) => {
  const now = new Date()
  const begin = new Date(beginDate)
  const end = new Date(endDate)

  if (now > end) {
    return VOTING_STAGES.RESULT
  } else if (now > begin && now < end) {
    return VOTING_STAGES.VOTE
  } else {
    return VOTING_STAGES.INFO
  }
}
