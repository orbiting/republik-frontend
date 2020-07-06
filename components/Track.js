import { Component } from 'react'
import Router from 'next/router'

import { parse, format } from 'url'

import withMe from '../lib/apollo/withMe'
import track from '../lib/piwik'
import { payload, getUtmParams } from '../lib/utils/track'

import { PUBLIC_BASE_URL } from '../lib/constants'

import { PSP_PLEDGE_ID_QUERY_KEYS } from './Payment/constants'

const trackRoles = me =>
  track([
    'setCustomDimension',
    1,
    me
      ? []
          .concat(me.roles)
          .sort()
          .join(' ') || 'none'
      : 'guest'
  ])

const trackUrl = url => {
  // sanitize url
  const urlObject = parse(url, true)
  const { query, pathname } = urlObject

  // Redact receive payment psp payloads
  if (pathname === '/angebote' || pathname === '/en') {
    const key = PSP_PLEDGE_ID_QUERY_KEYS.find(key => query[key])
    if (key) {
      // redact all query params
      urlObject.query = { [key]: 'R*' }
    }
  }
  // Redact email and token for notification, pledge and sign in pages
  if (query.email) {
    query.email = 'R'
  }
  if (query.token) {
    query.token = 'R'
  }
  // ensure query string is calculated from query object
  urlObject.search = undefined

  const sanitizedUrl = format(urlObject)

  payload.record('paths', parse(sanitizedUrl).path)
  const referrer = getUtmParams(query)
  if (Object.keys(referrer).length) {
    payload.record('referrers', referrer)
  }

  track(['setCustomUrl', sanitizedUrl])
  track(['setDocumentTitle', document.title])
  track(['trackPageView'])
}

class Track extends Component {
  componentDidMount() {
    payload.disable(this.props.me && this.props.me.activeMembership)
    trackRoles(this.props.me)
    trackUrl(window.location.href)
    Router.events.on('routeChangeComplete', this.onRouteChangeComplete)
  }
  onRouteChangeComplete = url => {
    // give pages time to set correct page title
    // may not always be enough, e.g. if data dependent and slow query/network, but works fine for many cases
    setTimeout(() => {
      // update url and title manually, necessary after client navigation
      trackUrl(`${PUBLIC_BASE_URL}${url}`)
    }, 600)
  }
  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.onRouteChangeComplete)
  }
  UNSAFE_componentWillReceiveProps({ me }) {
    if (
      me !== this.props.me &&
      (!me || !this.props.me || me.email !== this.props.me.email)
    ) {
      // start new visit with potentially different roles
      track(['appendToTrackingUrl', 'new_visit=1'])
      track(['deleteCookies'])
      trackRoles(me)
    }
    payload.disable(me && me.activeMembership)
  }
  render() {
    return null
  }
}

export default withMe(Track)
