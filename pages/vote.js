import Page from '../components/Vote/Page'
import withData from '../lib/apollo/withData'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'

export default compose(
  withData,
  enforceMembership
)(Page)
