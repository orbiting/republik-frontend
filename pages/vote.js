import Page from '../components/Vote/Page'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'

export default compose(
  enforceMembership
)(Page)
