import { Component } from 'react'

import withMe from '../../lib/apollo/withMe'
import track from '../../lib/piwik'

const trackRoles = me =>
  track([
    'setCustomDimension',
    1,
    me
      ? [].concat(me.roles).sort().join(' ') || 'none'
      : 'guest'
  ])

// ToDo: move client side navigation tracking from LoadingBar here after next upgrade (multiple router event listener)

class Track extends Component {
  componentDidMount () {
    trackRoles(this.props.me)
    track(['trackPageView'])
  }
  componentWillReceiveProps ({ me }) {
    if (
      me !== this.props.me &&
      ((!me || !this.props.me) || me.email !== this.props.me.email)
    ) {
      // start new visit with potentially different roles
      track(['appendToTrackingUrl', 'new_visit=1'])
      track(['deleteCookies'])
      trackRoles(me)
    }
  }
  render () {
    return null
  }
}

export default withMe(Track)
