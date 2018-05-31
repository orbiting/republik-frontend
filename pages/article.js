import withData from '../lib/apollo/withData'
import withNativeSupport from '../lib/nativeApp'
import { compose } from 'react-apollo'
import Page from '../components/Article/Page'

export default compose(
  withData,
  withNativeSupport
)(Page)
