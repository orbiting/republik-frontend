import { compose } from 'react-apollo'
import { enforceMembership } from '../../../components/Auth/withMembership'
import withMe from '../../../lib/apollo/withMe'
import DiscussionPage from '../../../components/Vote/201912/DiscussionPage'

export default compose(enforceMembership(), withMe)(DiscussionPage)
