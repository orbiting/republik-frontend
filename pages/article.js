import { compose } from 'react-apollo'
import withData from '../lib/apollo/withData'
import withInNativeApp from '../lib/withInNativeApp'
import Page from '../components/Article/Page'

export default compose(withData, withInNativeApp)(Page)
