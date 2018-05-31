import { compose } from 'react-apollo'
import Profile from '../components/Profile/Page'
import withData from '../lib/apollo/withData'
import withNativeSupport from '../lib/nativeApp'

export default compose(
  withData,
  withNativeSupport
)(Profile)
