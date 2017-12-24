import { compose } from 'react-apollo'
import Profile from '../components/Profile/Page'
import withData from '../lib/apollo/withData'

export default compose(
  withData
)(Profile)
