import React, { useEffect, useContext, useState } from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { parse } from 'url'
import { useRouter } from 'next/router'

import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { parseJSONObject } from '../../lib/safeJSON'
import createPersistedState from '../../lib/hooks/use-persisted-state'
import withMe from '../../lib/apollo/withMe'
import { withProgressApi } from '../Article/Progress/api'

import AppSignInOverlay from './AppSignInOverlay'

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

const useLocalMediaProgressState = createPersistedState(
  'republik-progress-media'
)

const MessageSync = ({
  inNativeApp,
  inNativeIOSApp,
  inNativeAppLegacy,
  upsertDevice,
  me,
  upsertMediaProgress,
  client
}) => {
  const [signInQuery, setSignInQuery] = useState()
  const [
    localMediaProgress,
    setLocalMediaProgress
  ] = useLocalMediaProgressState()
  const isTrackingAllowed = me && me.progressConsent === true
  const router = useRouter()
  const inNewApp = inNativeApp && !inNativeAppLegacy

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

  useEffect(() => {
    if (!inNewApp) {
      return
    }
    const handleRouteChange = url => {
      console.log(`App is changing to ${url}`)
      postMessage({
        type: 'routeChange',
        // ToDo: replace default "canGoBack: true "
        payload: { url, canGoBack: true }
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [inNewApp])

  useEffect(() => {
    if (!me) {
      return
    }
    checkPendingAppSignIn()
  }, [me])

  useEffect(() => {
    if (!inNewApp) {
      return
    }
    const onMessage = event => {
      const { content = {}, id } = parseJSONObject(event.data)
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
        if (isTrackingAllowed) {
          upsertMediaProgress(mediaId, currentTime)
        } else {
          setLocalMediaProgress({ mediaId, currentTime })
        }
      } else if (content.type === 'appState') {
        // Check Whenever App becomes active (foreground)
        // opens signin page if theres a pending request
        if (content.current === 'active' && me) {
          checkPendingAppSignIn()
        }
      } else if (content.type === 'authorization') {
        checkPendingAppSignIn()
      }
      postMessage({
        type: 'ackMessage',
        id: id
      })
    }
    if (inNativeIOSApp) {
      window.addEventListener('message', onMessage)
    } else {
      document.addEventListener('message', onMessage)
    }
    return () => {
      if (inNativeIOSApp) {
        window.addEventListener('message', onMessage)
      } else {
        document.addEventListener('message', onMessage)
      }
    }
  }, [inNewApp, inNativeIOSApp, me])

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
  withMe,
  graphql(upsertDeviceQuery, { name: 'upsertDevice' }),
  withApollo,
  withInNativeApp,
  withProgressApi
)(MessageSync)
