import React from 'react'
import withData from '../lib/apollo/withData'

import Frame from '../components/Frame'
import StatusError from '../components/StatusError'

class ErrorPage extends React.Component {
  static getInitialProps ({ res, err }) {
    const statusCode = res
      ? res.statusCode
      : err ? err.statusCode : null
    return { statusCode }
  }

  render () {
    const { url, statusCode, serverContext } = this.props
    return (
      <Frame url={url} raw>
        <StatusError url={url} statusCode={statusCode} serverContext={serverContext} />
      </Frame>
    )
  }
}

export default withData(ErrorPage)
