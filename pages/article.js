import { compose } from 'react-apollo'
import withData from '../lib/apollo/withData'
import Page from '../components/Article/Page'

export default compose(withData)(Page)
