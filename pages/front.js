import { compose } from 'react-apollo'
import Front from '../components/Front'
import withData from '../lib/apollo/withData'
import { enforceMembership } from '../components/Auth/withMembership'

export default compose(
  withData,
  enforceMembership
)(Front)
