import DiscussionPage from '../../../components/Vote/201907/DiscussionPage'
import compose from 'lodash/flowRight'
import { enforceMembership } from '../../../components/Auth/withMembership'
import withMe from '../../../lib/apollo/withMe'
import withDefaultSSR from '../../../lib/hocs/withDefaultSSR'

export default withDefaultSSR(
  compose(enforceMembership(), withMe)(DiscussionPage)
)
