import compose from 'lodash/flowRight'
import { enforceMembership } from '../../../components/Auth/withMembership'
import withMe from '../../../lib/apollo/withMe'
import DiscussionPage from '../../../components/Vote/201912/DiscussionPage'
import withDefaultSSR from '../../../lib/hocs/withDefaultSSR'

export default withDefaultSSR(
  compose(enforceMembership(), withMe)(DiscussionPage)
)
