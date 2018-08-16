import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Front from '../components/Front'
import withData from '../lib/apollo/withData'
import withMembership, { UnauthorizedPage } from '../components/Auth/withMembership'
import StatusError from '../components/StatusError'

const KNOWN_PATHS = ['/feuilleton']

const FrontPage = (props) => {
  if (props.isMember) {
    return <Front {...props} />
  }
  const { url } = props
  if (KNOWN_PATHS.indexOf(url.asPath.split('?')[0]) !== -1) {
    return <UnauthorizedPage {...props} />
  }
  return (
    <Frame raw url={url}>
      <StatusError
        url={url}
        statusCode={404}
        serverContext={props.serverContext} />
    </Frame>
  )
}

export default compose(
  withData,
  withMembership
)(FrontPage)
