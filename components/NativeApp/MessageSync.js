import React, { useEffect, useState } from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { parse } from 'url'
import { useRouter } from 'next/router'

import { useInNativeApp, postMessage } from '../../lib/withInNativeApp'
import withMe from '../../lib/apollo/withMe'
import { PUBLIC_BASE_URL } from '../../lib/constants'
import { Router } from '../../lib/routes'

import AppSignInOverlay from './AppSignInOverlay'
import { useMediaProgress } from '../Audio/MediaProgress'
import { usePersistedOSColorSchemeKey } from '../ColorScheme/lib'

const upsertDeviceQuery = gql`
  mutation UpsertDevice($token: ID!, $information: DeviceInformationInput!) {
    upsertDevice(token: $token, information: $information) {
      id
    }
  }
`

const pendingAppSignInQuery = gql`
  query pendingAppSignIn {
    pendingAppSignIn {
      title
      body
      expiresAt
      verificationUrl
    }
  }
`

const MessageSync = ({ upsertDevice, me, client }) => {
  const [signInQuery, setSignInQuery] = useState()
  const router = useRouter()
  const [_, setOSColorScheme] = usePersistedOSColorSchemeKey()

  useEffect(() => {
    const handleRouteChange = url => {
      postMessage({
        type: 'routeChange',
        payload: { url }
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  const { saveMediaProgress } = useMediaProgress()
  useEffect(() => {
    async function checkPendingAppSignIn() {
      const {
        data: { pendingAppSignIn }
      } = await client.query({
        query: pendingAppSignInQuery,
        fetchPolicy: 'network-only'
      })
      if (pendingAppSignIn) {
        const verificationUrlObject = parse(
          pendingAppSignIn.verificationUrl,
          true
        )
        const { query } = verificationUrlObject
        setSignInQuery(query)
      }
    }
    if (me) {
      checkPendingAppSignIn()
    }
    const onMessage = event => {
      const { content = {}, id } = event.data
      if (content.type === 'onPushRegistered') {
        // Register Notification Token
        const {
          token,
          os,
          osVersion,
          model,
          appVersion,
          userAgent
        } = content.data
        upsertDevice({
          variables: {
            token,
            information: {
              os,
              osVersion,
              model,
              appVersion,
              userAgent
            }
          }
        })
      } else if (content.type === 'onAppMediaProgressUpdate') {
        // Audio Player sent media progress update
        const { currentTime, mediaId } = content
        saveMediaProgress({ mediaId }, { currentTime })
      } else if (content.type === 'appState') {
        // Check Whenever App becomes active (foreground)
        // opens signin page if theres a pending request
        if (content.current === 'active' && me) {
          checkPendingAppSignIn()
        }
      } else if (content.type === 'authorization') {
        checkPendingAppSignIn()
      } else if (content.type === 'push-route') {
        const targetUrl = content.url.replace(PUBLIC_BASE_URL, '')
        Router.pushRoute(targetUrl).then(() => {
          if (targetUrl.indexOf('#') === -1) {
            window.scrollTo(0, 0)
          }
        })
      } else if (content.type === 'osColorScheme') {
        if (content.value) {
          setOSColorScheme(content.value)
        }
      }
      postMessage({
        type: 'ackMessage',
        id: id
      })
    }
    document.addEventListener('message', onMessage)
    return () => {
      document.removeEventListener('message', onMessage)
    }
  }, [me])

  if (signInQuery) {
    return (
      <AppSignInOverlay
        query={signInQuery}
        setQuery={setSignInQuery}
        onClose={() => setSignInQuery(null)}
      />
    )
  }
  return null
}

export default compose(
  WrappedComponent => {
    const InNewAppOnly = props => {
      const { inNativeApp, inNativeAppLegacy } = useInNativeApp()
      if (inNativeApp && !inNativeAppLegacy) {
        return <WrappedComponent {...props} />
      }
      return null
    }

    return InNewAppOnly
  },
  withMe,
  graphql(upsertDeviceQuery, { name: 'upsertDevice' }),
  withApollo
)(MessageSync)
