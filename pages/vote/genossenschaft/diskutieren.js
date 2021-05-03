import ElectionDiscussionPage from '../../../components/Vote/ElectionDiscussionPage'
import { compose } from 'react-apollo'
import { enforceMembership } from '../../../components/Auth/withMembership'
import withMe from '../../../lib/apollo/withMe'

export default compose(enforceMembership(), withMe)(ElectionDiscussionPage)
