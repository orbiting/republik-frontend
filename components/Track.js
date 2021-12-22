import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import { parse, format } from 'url'

import track from '../lib/matomo'
import { payload, getUtmParams } from '../lib/utils/track'
import { useInNativeApp } from '../lib/withInNativeApp'

import { PUBLIC_BASE_URL } from '../lib/constants'

import { PSP_PLEDGE_ID_QUERY_KEYS } from './Payment/constants'
import { useMe } from '../lib/context/MeContext'

function redactURL(rawURL) {
  const url = new URL(rawURL, PUBLIC_BASE_URL)

  // Redact receive payment psp payloads
  if (url.pathname === '/angebote' || url.pathname === '/en') {
    const key = PSP_PLEDGE_ID_QUERY_KEYS.find(key => url.searchParams.has(key))
    if (key) {
      // redact all query params
      const newSearchParams = new URLSearchParams()
      newSearchParams.set(key, 'R*')
      url.searchParams = newSearchParams
    }
  }

  const queryParamsBlacklist = [
    'email',
    'token',
    // rm fb and google click ids
    'fbclid',
    'gclid'
  ]

  if (url.pathname === '/abholen') {
    queryParamsBlacklist.push('code')
  }

  for (const key of queryParamsBlacklist) {
    if (url.searchParams.has(key)) {
      url.searchParams.set(key, 'R')
    }
  }

  return url
}

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
  const sanitizedUrl = redactURL(url)
  payload.record('paths', sanitizedUrl.pathname)
  const referrer = getUtmParams(sanitizedUrl.searchParams)
  if (Object.keys(referrer).length) {
    payload.record('referrers', referrer)
  }
  console.debug('trackUrl', sanitizedUrl)
  track(['setCustomUrl', sanitizedUrl])
  track(['setDocumentTitle', document.title])
  track(['trackPageView'])
}

const Track = () => {
  const { me, meLoading } = useMe()
  const lastMeRef = useRef()
  const router = useRouter()

  useEffect(() => {
    if (meLoading) {
      return
    }
    const prevMe = lastMeRef.current

    if (prevMe !== me && (!prevMe || !me || prevMe.email !== me.email)) {
      if (prevMe !== undefined) {
        // start new visit with potentially different roles
        track(['appendToTrackingUrl', 'new_visit=1'])
        track(['deleteCookies'])
      }
      trackRoles(me)
      lastMeRef.current = me
    }
    payload.disable(me?.activeMembership)
  }, [me, meLoading])

  const { inNativeAppVersion } = useInNativeApp()
  useEffect(() => {
    if (inNativeAppVersion) {
      track(['setCustomDimension', 2, inNativeAppVersion])
    } else {
      track(['deleteCustomDimension', 2])
    }
  }, [inNativeAppVersion])

  useEffect(() => {
    if (router.isReady) {
      trackUrl(window.location.href)
    }

    const onRouteChangeComplete = url => {
      // give pages time to set correct page title
      // may not always be enough, e.g. if data dependent and slow query/network, but works fine for many cases
      setTimeout(() => {
        // update url and title manually, necessary after client navigation
        trackUrl(`${PUBLIC_BASE_URL}${url}`)
      }, 600)
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  return null
}

export default Track
