import DiscussionPage from '../../../components/Vote/201907/DiscussionPage'
import { flowRight as compose } from 'lodash'
import { enforceMembership } from '../../../components/Auth/withMembership'
import withMe from '../../../lib/apollo/withMe'

export default compose(enforceMembership(), withMe)(DiscussionPage)
