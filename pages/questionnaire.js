import Page from '../components/Questionnaire/Page'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'

export default compose(
  enforceMembership
)(Page)
