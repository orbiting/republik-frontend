import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { withQuestionnaire } from './enhancers'
import Questionnaire from './Questionnaire'

export default compose(
  withRouter,
  withQuestionnaire
)(Questionnaire)
