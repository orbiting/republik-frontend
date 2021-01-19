import React, { useEffect, useContext, useState } from 'react'
import { graphql, compose } from 'react-apollo'
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
  inNativeAppLegacy,
  upsertDevice,
  me,
  upsertMediaProgress,
  refetchPendingSignInRequests
}) => {
  const [signInOverlayVisible, setSignInOverlayVisible] = useState(false)
  const [signInData, setsignInData] = useState()
  const [
    localMediaProgress,
    setLocalMediaProgress
  ] = useLocalMediaProgressState()
  const isTrackingAllowed = me && me.progressConsent === true
  const router = useRouter()

  async function openSignInPageIfRequest() {
    const {
      data: { pendingAppSignIn }
    } = await refetchPendingSignInRequests()
    if (pendingAppSignIn) {
      const verificationUrlObject = parse(
        pendingAppSignIn.verificationUrl,
        true
      )
      const { query } = verificationUrlObject
      setsignInData(query)
      setSignInOverlayVisible(true)
    }
  }

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const checkIfPendingSignInRequest = setInterval(() => {
      if (me) {
        openSignInPageIfRequest()
      }
    }, 3000)
    return () => {
      clearInterval(checkIfPendingSignInRequest)
    }
  }, [])

  useEffect(() => {
    if (!inNativeApp || inNativeAppLegacy) {
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
        if (content.current === 'active') {
          if (me) {
            openSignInPageIfRequest()
          }
        }
      }
      postMessage({
        type: 'ackMessage',
        id: id
      })
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [inNativeApp, inNativeAppLegacy, refetchPendingSignInRequests])

  if (signInOverlayVisible && signInData) {
    return (
      <AppSignInOverlay
        signInData={signInData}
        closeSignInOverlay={() => setSignInOverlayVisible(false)}
      />
    )
  } else {
    return null
  }
}

export default compose(
  withMe,
  graphql(upsertDeviceQuery, { name: 'upsertDevice' }),
  graphql(pendingAppSignInQuery, {
    skip: props => !props.me,
    options: {
      fetchPolicy: 'network-only'
    },
    props: ({ data }) => {
      return {
        pendingAppSignIn: data.pendingAppSignIn,
        refetchPendingSignInRequests: data.refetch
      }
    }
  }),
  withInNativeApp,
  withProgressApi
)(MessageSync)
